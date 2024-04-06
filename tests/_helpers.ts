export async function expectError(callbackFn: () => Promise<void>) {
  const originalConsoleErrorFn = console.error;
  console.error = jest.fn();
  await expect(callbackFn).rejects.toThrow(Error);
  console.error = originalConsoleErrorFn;
}

export async function expectSuccess(callbackFn: () => Promise<void>) {
  await callbackFn();
}
