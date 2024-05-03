export function asyncSleep(millis: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millis));
}
