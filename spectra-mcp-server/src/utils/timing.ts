export async function pollUntil(
  fn: () => Promise<boolean>,
  timeout: number,
  interval = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await sleep(interval);
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(message || `Timeout after ${ms}ms`)),
        ms
      )
    ),
  ]);
}
