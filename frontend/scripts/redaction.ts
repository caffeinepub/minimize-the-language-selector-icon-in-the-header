export function redactSensitiveData(text: string): string {
  let redacted = text;

  // Redact common API key patterns
  redacted = redacted.replace(
    /\b[A-Za-z0-9_-]{32,}\b/g,
    (match) => {
      if (/^[A-Za-z0-9_-]{32,}$/.test(match)) {
        return '[REDACTED_KEY]';
      }
      return match;
    }
  );

  // Redact Bearer tokens
  redacted = redacted.replace(
    /Bearer\s+[A-Za-z0-9_\-\.]+/gi,
    'Bearer [REDACTED_TOKEN]'
  );

  // Redact PEM blocks
  redacted = redacted.replace(
    /-----BEGIN [A-Z\s]+-----[\s\S]*?-----END [A-Z\s]+-----/g,
    '[REDACTED_PEM_BLOCK]'
  );

  // Redact principal IDs (IC-specific)
  redacted = redacted.replace(
    /\b[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}\b/g,
    '[REDACTED_PRINCIPAL]'
  );

  // Redact email addresses
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[REDACTED_EMAIL]'
  );

  // Redact URLs with credentials
  redacted = redacted.replace(
    /https?:\/\/[^:]+:[^@]+@[^\s]+/g,
    '[REDACTED_URL_WITH_CREDENTIALS]'
  );

  return redacted;
}

export function redactLogFile(content: string): string {
  return redactSensitiveData(content);
}
