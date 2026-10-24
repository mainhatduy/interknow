export interface FunctionModel {
  id: string;
  name: string;
  latex: string;
  derivativeLatex: string;
  f: (x: number) => number;
  df: (x: number) => number;
  defaultX: number;
  domain: [number, number]; // [minX, maxX]
  range: [number, number];  // [minY, maxY]
}

export const FUNCTION_PRESETS: FunctionModel[] = [
  {
    id: 'parabola',
    name: 'Parabol (Bậc hai)',
    latex: 'f(x) = 0.4x^2 - 0.8x + 1.2',
    derivativeLatex: "f'(x) = 0.8x - 0.8",
    f: (x: number) => 0.4 * x * x - 0.8 * x + 1.2,
    df: (x: number) => 0.8 * x - 0.8,
    defaultX: 2.2,
    domain: [-1, 5],
    range: [-0.5, 6],
  },
  {
    id: 'cubic',
    name: 'Đường cong bậc ba',
    latex: 'f(x) = 0.15x^3 - 0.8x^2 + x + 2',
    derivativeLatex: "f'(x) = 0.45x^2 - 1.6x + 1",
    f: (x: number) => 0.15 * Math.pow(x, 3) - 0.8 * Math.pow(x, 2) + x + 2,
    df: (x: number) => 0.45 * Math.pow(x, 2) - 1.6 * x + 1,
    defaultX: 2.8,
    domain: [-1, 6],
    range: [-1, 5],
  },
  {
    id: 'sine',
    name: 'Sóng hình Sin',
    latex: 'f(x) = 1.5\\sin(x) + 2.5',
    derivativeLatex: "f'(x) = 1.5\\cos(x)",
    f: (x: number) => 1.5 * Math.sin(x) + 2.5,
    df: (x: number) => 1.5 * Math.cos(x),
    defaultX: 1.0,
    domain: [-1, 7],
    range: [-0.5, 5],
  },
];

export interface CalculusState {
  x0: number;
  deltaX: number;
  y0: number;
  x1: number;
  y1: number;
  deltaY: number;
  secantSlope: number;
  tangentSlope: number;
  slopeDifference: number;
  secantLine: [number, number][]; // 2 points across domain [minX, maxX]
  tangentLine: [number, number][]; // 2 points across domain [minX, maxX]
}

export function computeCalculusState(
  func: FunctionModel,
  x0: number,
  deltaX: number
): CalculusState {
  // Avoid exact division by 0
  const safeDeltaX = Math.abs(deltaX) < 1e-6 ? (deltaX >= 0 ? 1e-6 : -1e-6) : deltaX;

  const y0 = func.f(x0);
  const x1 = x0 + safeDeltaX;
  const y1 = func.f(x1);

  const deltaY = y1 - y0;
  const secantSlope = deltaY / safeDeltaX;
  const tangentSlope = func.df(x0);
  const slopeDifference = Math.abs(secantSlope - tangentSlope);

  const [minX, maxX] = func.domain;

  // Secant line equation: y - y0 = secantSlope * (x - x0) => y = y0 + secantSlope * (x - x0)
  const secantLine: [number, number][] = [
    [minX, y0 + secantSlope * (minX - x0)],
    [maxX, y0 + secantSlope * (maxX - x0)],
  ];

  // Tangent line equation: y - y0 = tangentSlope * (x - x0) => y = y0 + tangentSlope * (x - x0)
  const tangentLine: [number, number][] = [
    [minX, y0 + tangentSlope * (minX - x0)],
    [maxX, y0 + tangentSlope * (maxX - x0)],
  ];

  return {
    x0,
    deltaX: safeDeltaX,
    y0,
    x1,
    y1,
    deltaY,
    secantSlope,
    tangentSlope,
    slopeDifference,
    secantLine,
    tangentLine,
  };
}

export function sampleFunctionCurve(
  func: FunctionModel,
  samples = 150
): [number, number][] {
  const [minX, maxX] = func.domain;
  const step = (maxX - minX) / (samples - 1);
  const points: [number, number][] = [];

  for (let i = 0; i < samples; i++) {
    const x = minX + i * step;
    points.push([x, func.f(x)]);
  }

  return points;
}
