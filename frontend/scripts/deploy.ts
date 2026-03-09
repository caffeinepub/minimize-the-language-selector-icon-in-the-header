#!/usr/bin/env node

import { runStep, isTransientFailure, StepResult } from './deploySteps';
import { redactLogFile } from './redaction';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 3000;

interface DeployConfig {
  steps: Array<{
    label: string;
    command: string;
    args: string[];
    cwd?: string;
  }>;
}

const deployConfig: DeployConfig = {
  steps: [
    {
      label: 'Generate backend bindings',
      command: 'dfx',
      args: ['generate', 'backend'],
    },
    {
      label: 'Build frontend',
      command: 'npm',
      args: ['run', 'build:skip-bindings'],
      cwd: './frontend',
    },
    {
      label: 'Deploy canisters',
      command: 'dfx',
      args: ['deploy'],
    },
  ],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runStepWithRetry(
  label: string,
  command: string,
  args: string[],
  cwd?: string,
  attempt: number = 1
): Promise<StepResult> {
  const result = await runStep(label, command, args, cwd);

  if (!result.success && isTransientFailure(result) && attempt <= MAX_RETRIES) {
    console.log(
      `\n⚠️  Transient failure detected. Retrying in ${RETRY_DELAY_MS / 1000}s... (Attempt ${attempt}/${MAX_RETRIES})`
    );
    await sleep(RETRY_DELAY_MS);
    return runStepWithRetry(label, command, args, cwd, attempt + 1);
  }

  return result;
}

function writeFailureLog(results: StepResult[]): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logDir = join(process.cwd(), 'frontend', 'deploy-logs');

  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  const logPath = join(logDir, `deploy-failure-${timestamp}.log`);
  const latestLogPath = join(logDir, 'latest-failure.log');

  let logContent = `Deployment Failure Log\n`;
  logContent += `Timestamp: ${new Date().toISOString()}\n`;
  logContent += `=`.repeat(80) + '\n\n';

  for (const result of results) {
    logContent += `Step: ${result.label}\n`;
    logContent += `Exit Code: ${result.exitCode}\n`;
    logContent += `Success: ${result.success}\n`;
    logContent += `-`.repeat(80) + '\n';

    if (result.stdout) {
      logContent += `STDOUT:\n${result.stdout}\n`;
      logContent += `-`.repeat(80) + '\n';
    }

    if (result.stderr) {
      logContent += `STDERR:\n${result.stderr}\n`;
      logContent += `-`.repeat(80) + '\n';
    }

    logContent += '\n';
  }

  const redactedContent = redactLogFile(logContent);

  writeFileSync(logPath, redactedContent, 'utf-8');
  writeFileSync(latestLogPath, redactedContent, 'utf-8');

  return logPath;
}

async function main() {
  console.log('🚀 Starting deployment workflow...\n');

  const results: StepResult[] = [];
  let allSuccess = true;

  for (const step of deployConfig.steps) {
    const result = await runStepWithRetry(
      step.label,
      step.command,
      step.args,
      step.cwd
    );

    results.push(result);

    if (!result.success) {
      allSuccess = false;
      console.error(`\n❌ Deployment failed at step: ${step.label}`);
      console.error(`   Exit code: ${result.exitCode}`);

      if (result.stderr) {
        console.error(`\n📋 Error output (last 20 lines):`);
        const lines = result.stderr.split('\n').filter((l) => l.trim());
        const lastLines = lines.slice(-20);
        lastLines.forEach((line) => console.error(`   ${line}`));
      }

      break;
    }
  }

  if (!allSuccess) {
    const logPath = writeFailureLog(results);
    console.error(`\n📝 Failure log written to: ${logPath}`);
    console.error(`   Latest log also available at: frontend/deploy-logs/latest-failure.log`);
    console.error(`\n💡 To report this issue, please include:`);
    console.error(`   - The log file above`);
    console.error(`   - The failing step label`);
    console.error(`   - The exit code`);
    console.error(`\n⚠️  Note: Logs are redacted but please review before sharing.`);

    process.exit(1);
  }

  console.log('\n✅ Deployment completed successfully!');
  console.log('🎉 All steps passed.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('💥 Unexpected error during deployment:', err);
  process.exit(1);
});
