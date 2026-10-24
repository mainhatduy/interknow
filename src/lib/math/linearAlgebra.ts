export type Matrix2x2 = [
  [number, number], // [a, b] => col 0 is [a, c], col 1 is [b, d]
  [number, number]  // [c, d]
];

export type Vector2D = [number, number]; // [x, y]

export interface MatrixPreset {
  id: string;
  name: string;
  matrix: Matrix2x2;
  description: string;
  latex: string;
}

export const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: 'identity',
    name: 'Đồng nhất (Identity)',
    matrix: [
      [1, 0],
      [0, 1],
    ],
    description: 'Không gian giữ nguyên không thay đổi.',
    latex: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
  },
  {
    id: 'shear-x',
    name: 'Phép trượt ngang (Shear X)',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    description: 'Trục Ox giữ nguyên, trục Oy nghiêng 45° sang phải. Diện tích không đổi.',
    latex: '\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}',
  },
  {
    id: 'rotate-90',
    name: 'Phép quay 90° (Rotation)',
    matrix: [
      [0, -1],
      [1, 0],
    ],
    description: 'Toàn bộ lưới quay 90 độ ngược chiều kim đồng hồ.',
    latex: '\\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}',
  },
  {
    id: 'reflection-x',
    name: 'Phép đối xứng qua Ox (Reflection)',
    matrix: [
      [1, 0],
      [0, -1],
    ],
    description: 'Không gian bị lật úp. Định thức mang giá trị âm (-1), đổi hướng định hướng không gian.',
    latex: '\\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}',
  },
  {
    id: 'scale',
    name: 'Co giãn bất đối xứng (Scaling)',
    matrix: [
      [1.5, 0],
      [0, 0.6],
    ],
    description: 'Kéo giãn theo phương x gấp 1.5 lần, nén theo phương y còn 0.6 lần.',
    latex: '\\begin{bmatrix} 1.5 & 0 \\\\ 0 & 0.6 \\end{bmatrix}',
  },
  {
    id: 'singular',
    name: 'Suy biến (Singular / det = 0)',
    matrix: [
      [1, 2],
      [0.5, 1],
    ],
    description: 'Toàn bộ mặt phẳng 2D bị ép bẹp thành 1 đường thẳng duy nhất! det(A) = 0.',
    latex: '\\begin{bmatrix} 1 & 2 \\\\ 0.5 & 1 \\end{bmatrix}',
  },
];

export function multiplyMatrixVector(m: Matrix2x2, v: Vector2D): Vector2D {
  const [a, b] = m[0];
  const [c, d] = m[1];
  const [x, y] = v;
  return [a * x + b * y, c * x + d * y];
}

export function computeDeterminant(m: Matrix2x2): number {
  const [a, b] = m[0];
  const [c, d] = m[1];
  return a * d - b * c;
}

export function interpolateMatrix(
  m1: Matrix2x2,
  m2: Matrix2x2,
  t: number
): Matrix2x2 {
  const clampedT = Math.max(0, Math.min(1, t));
  return [
    [
      m1[0][0] + (m2[0][0] - m1[0][0]) * clampedT,
      m1[0][1] + (m2[0][1] - m1[0][1]) * clampedT,
    ],
    [
      m1[1][0] + (m2[1][0] - m1[1][0]) * clampedT,
      m1[1][1] + (m2[1][1] - m1[1][1]) * clampedT,
    ],
  ];
}

export interface GridLine {
  id: string;
  isAxis: boolean;
  isMain: boolean;
  points: [Vector2D, Vector2D]; // start and end
}

export function generateTransformedGrid(
  matrix: Matrix2x2,
  range = 4,
  step = 1
): { lines: GridLine[]; iHatTransformed: Vector2D; jHatTransformed: Vector2D; determinant: number } {
  const lines: GridLine[] = [];

  // Vertical lines (fixed x, varying y)
  for (let x = -range; x <= range; x += step) {
    const start = multiplyMatrixVector(matrix, [x, -range]);
    const end = multiplyMatrixVector(matrix, [x, range]);
    lines.push({
      id: `v_${x}`,
      isAxis: x === 0,
      isMain: x % 2 === 0,
      points: [start, end],
    });
  }

  // Horizontal lines (varying x, fixed y)
  for (let y = -range; y <= range; y += step) {
    const start = multiplyMatrixVector(matrix, [-range, y]);
    const end = multiplyMatrixVector(matrix, [range, y]);
    lines.push({
      id: `h_${y}`,
      isAxis: y === 0,
      isMain: y % 2 === 0,
      points: [start, end],
    });
  }

  const iHatTransformed = multiplyMatrixVector(matrix, [1, 0]);
  const jHatTransformed = multiplyMatrixVector(matrix, [0, 1]);
  const determinant = computeDeterminant(matrix);

  return {
    lines,
    iHatTransformed,
    jHatTransformed,
    determinant,
  };
}
