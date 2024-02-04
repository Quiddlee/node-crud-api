import { describe, expect, it } from 'vitest';

export function sum(a: number, b: number) {
  return a + b;
}

describe('test test', () => {
  it('should sum', () => {
    expect(sum(1, 1)).toBe(2);
  });
});
