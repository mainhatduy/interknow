import { describe, it, expect } from 'vitest';
import {
  multiplyMatrixVector,
  computeDeterminant,
  interpolateMatrix,
  generateTransformedGrid,
  MATRIX_PRESETS,
} from '../lib/math/linearAlgebra';

describe('2D Linear Algebra Simulator', () => {
  it('correctly transforms unit vectors with Identity matrix', () => {
    const identity = MATRIX_PRESETS[0].matrix;
    expect(multiplyMatrixVector(identity, [1, 0])).toEqual([1, 0]);
    expect(multiplyMatrixVector(identity, [0, 1])).toEqual([0, 1]);
    expect(computeDeterminant(identity)).toBe(1);
  });

  it('correctly transforms with 90 deg rotation matrix', () => {
    const rot90 = MATRIX_PRESETS[2].matrix; // [[0, -1], [1, 0]]
    expect(multiplyMatrixVector(rot90, [1, 0])).toEqual([0, 1]);
    expect(multiplyMatrixVector(rot90, [0, 1])).toEqual([-1, 0]);
    expect(computeDeterminant(rot90)).toBe(1);
  });

  it('detects singular transformation with zero determinant', () => {
    const singular = MATRIX_PRESETS[5].matrix; // [[1, 2], [0.5, 1]]
    expect(computeDeterminant(singular)).toBeCloseTo(0, 5);
  });

  it('interpolates smoothly between identity and target matrix', () => {
    const identity = MATRIX_PRESETS[0].matrix;
    const shear = MATRIX_PRESETS[1].matrix; // [[1, 1], [0, 1]]
    const half = interpolateMatrix(identity, shear, 0.5);
    expect(half[0][1]).toBeCloseTo(0.5, 5);
  });

  it('generates grid lines and transformed basis vectors', () => {
    const shear = MATRIX_PRESETS[1].matrix;
    const result = generateTransformedGrid(shear, 3, 1);
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.iHatTransformed).toEqual([1, 0]);
    expect(result.jHatTransformed).toEqual([1, 1]);
  });
});
