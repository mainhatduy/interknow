import { describe, it, expect } from 'vitest';
import { generateBinarySearchSteps } from '../lib/algorithms/binarySearch';

describe('Binary Search Step Generator', () => {
  const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

  it('generates steps and finds element at the beginning', () => {
    const steps = generateBinarySearchSteps(arr, 2);
    expect(steps.length).toBeGreaterThan(1);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.status).toBe('found');
    expect(lastStep.mid).toBe(0);
  });

  it('generates steps and finds element in the middle', () => {
    const steps = generateBinarySearchSteps(arr, 16);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.status).toBe('found');
    expect(lastStep.mid).toBe(4);
    expect(arr[lastStep.mid]).toBe(16);
  });

  it('generates steps and finds element at the end', () => {
    const steps = generateBinarySearchSteps(arr, 91);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.status).toBe('found');
    expect(lastStep.mid).toBe(9);
  });

  it('properly returns not-found when target is not present', () => {
    const steps = generateBinarySearchSteps(arr, 50);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.status).toBe('not-found');
    expect(lastStep.mid).toBe(-1);
  });

  it('handles empty array gracefully', () => {
    const steps = generateBinarySearchSteps([], 10);
    expect(steps.length).toBe(1);
    expect(steps[0].status).toBe('not-found');
  });
});
