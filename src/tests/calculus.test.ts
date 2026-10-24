import { describe, it, expect } from 'vitest';
import { FUNCTION_PRESETS, computeCalculusState } from '../lib/math/calculus';

describe('Calculus & Derivative Simulator', () => {
  const parabola = FUNCTION_PRESETS[0]; // f(x) = 0.4x^2 - 0.8x + 1.2, f'(x) = 0.8x - 0.8

  it('calculates exact tangent slope at x = 2', () => {
    const x0 = 2;
    // f'(2) = 0.8 * 2 - 0.8 = 0.8
    const state = computeCalculusState(parabola, x0, 0.0001);
    expect(state.tangentSlope).toBeCloseTo(0.8, 4);
  });

  it('demonstrates secant slope approaches tangent slope as deltaX -> 0', () => {
    const x0 = 2;
    const largeDelta = computeCalculusState(parabola, x0, 1.0);
    const smallDelta = computeCalculusState(parabola, x0, 0.01);
    const microDelta = computeCalculusState(parabola, x0, 0.0001);

    expect(smallDelta.slopeDifference).toBeLessThan(largeDelta.slopeDifference);
    expect(microDelta.slopeDifference).toBeLessThan(smallDelta.slopeDifference);
    expect(microDelta.secantSlope).toBeCloseTo(microDelta.tangentSlope, 3);
  });

  it('safely handles zero deltaX without dividing by zero', () => {
    const state = computeCalculusState(parabola, 2, 0);
    expect(Number.isFinite(state.secantSlope)).toBe(true);
  });
});
