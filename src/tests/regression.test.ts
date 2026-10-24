import { describe, it, expect } from 'vitest';
import {
  REGRESSION_DATA,
  linearPredict,
  meanSquaredError,
  formatEquation,
  fitLinearRegression,
} from '../lib/math/regression';

describe('Linear Regression math', () => {
  it('computes a linear prediction ŷ = w·x + b', () => {
    expect(linearPredict(0.05, 0, 80)).toBeCloseTo(4, 10);
    expect(linearPredict(0.05, 0, 120)).toBeCloseTo(6, 10);
    expect(linearPredict(2, 3, 5)).toBeCloseTo(13, 10);
  });

  it('returns zero MSE for an exact fit and nonzero MSE for the noisy lesson data', () => {
    expect(meanSquaredError([[40, 2], [60, 3], [80, 4]], 0.05, 0)).toBeCloseTo(0, 10);
    expect(meanSquaredError(REGRESSION_DATA, 0.05, 0)).toBeCloseTo(0.040625, 10);
    expect(meanSquaredError(REGRESSION_DATA, 0.03, 1)).toBeGreaterThan(
      meanSquaredError(REGRESSION_DATA, 0.05, 0)
    );
  });

  it('returns a positive MSE for a poor fit', () => {
    // Đường nằm ngang y = 0 rõ ràng sai với mọi điểm.
    expect(meanSquaredError(REGRESSION_DATA, 0, 0)).toBeGreaterThan(0);
  });

  it('formats the equation with the correct sign for b', () => {
    expect(formatEquation(0.05, 0)).toBe('\\hat{y} = 0.050x + 0.0');
    expect(formatEquation(0.05, -1.5)).toBe('\\hat{y} = 0.050x - 1.5');
  });

  it('fits slope and intercept from data rather than fixed lesson parameters', () => {
    const fit = fitLinearRegression([[1, 5], [2, 8], [3, 11], [4, 14]]);
    expect(fit.w).toBeCloseTo(3, 10);
    expect(fit.b).toBeCloseTo(2, 10);
  });

  it('minimizes squared error on the noisy lesson data without eliminating residuals', () => {
    const { w, b } = fitLinearRegression(REGRESSION_DATA);
    const minimum = meanSquaredError(REGRESSION_DATA, w, b);
    expect(w).toBeCloseTo(0.05, 10);
    expect(b).toBeCloseTo(0, 10);
    expect(minimum).toBeCloseTo(0.040625, 10);
    for (const [dw, db] of [[0.005, 0], [-0.005, 0], [0, 0.1], [0, -0.1]]) {
      expect(meanSquaredError(REGRESSION_DATA, w + dw, b + db)).toBeGreaterThan(minimum);
    }
  });

  it('uses the mean price when all input values are identical', () => {
    expect(fitLinearRegression([[2, 4], [2, 6], [2, 8]])).toEqual({ w: 0, b: 6 });
    expect(() => fitLinearRegression([])).toThrow();
  });
});
