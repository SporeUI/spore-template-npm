export function asyncLog(...args: unknown[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.info(...args);
      resolve();
    }, 100);
  });
};

export function square(x: number): number {
  return x * x;
}

export function cube(x: number): number {
  return x * x * x;
}
