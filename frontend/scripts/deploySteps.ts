import { spawn } from 'child_process';

export interface StepResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  label: string;
}

export async function runStep(
  label: string,
  command: string,
  args: string[],
  cwd?: string
): Promise<StepResult> {
  return new Promise((resolve) => {
    console.log(`\n🔄 Running step: ${label}`);
    console.log(`   Command: ${command} ${args.join(' ')}`);

    const proc = spawn(command, args, {
      cwd: cwd || process.cwd(),
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        process.stdout.write(text);
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        process.stderr.write(text);
      });
    }

    proc.on('close', (code) => {
      const exitCode = code || 0;
      const success = exitCode === 0;

      if (success) {
        console.log(`✅ Step completed: ${label}`);
      } else {
        console.error(`❌ Step failed: ${label} (exit code: ${exitCode})`);
      }

      resolve({
        success,
        exitCode,
        stdout,
        stderr,
        label,
      });
    });

    proc.on('error', (err) => {
      console.error(`❌ Step error: ${label}`, err);
      resolve({
        success: false,
        exitCode: -1,
        stdout,
        stderr: stderr + '\n' + err.message,
        label,
      });
    });
  });
}

export function isTransientFailure(result: StepResult): boolean {
  const transientPatterns = [
    /ECONNREFUSED/i,
    /ETIMEDOUT/i,
    /ENOTFOUND/i,
    /network error/i,
    /connection reset/i,
    /socket hang up/i,
    /temporary failure/i,
    /rate limit/i,
    /too many requests/i,
  ];

  const errorText = result.stderr + result.stdout;
  return transientPatterns.some((pattern) => pattern.test(errorText));
}
