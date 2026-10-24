export type Point = [number, number]; // [x, y]

/**
 * Bộ dữ liệu mẫu cho bài Linear Regression:
 * diện tích nhà (m²) -> giá nhà (tỷ VNĐ).
 * Giá dao động nhẹ quanh xu hướng tuyến tính, không nằm trên cùng một đường thẳng.
 */
export const REGRESSION_DATA: Point[] = [
  [40, 2.2],
  [50, 2.2],
  [60, 3.1],
  [70, 3.35],
  [80, 4.3],
  [90, 4.4],
  [100, 4.8],
  [110, 5.65],
];

/** Dự đoán của mô hình tuyến tính ŷ = w·x + b. */
export function linearPredict(w: number, b: number, x: number): number {
  return w * x + b;
}

/**
 * Sai số bình phương trung bình (Mean Squared Error) của mô hình
 * ŷ = w·x + b trên một tập dữ liệu.
 */
export function meanSquaredError(data: Point[], w: number, b: number): number {
  if (data.length === 0) return 0;

  let sum = 0;
  for (const [x, y] of data) {
    const error = y - linearPredict(w, b, x);
    sum += error * error;
  }
  return sum / data.length;
}

/** Least-squares fit for one input feature, with an intercept. */
export function fitLinearRegression(data: Point[]): { w: number; b: number } {
  if (data.length === 0) throw new Error('Cần ít nhất một quan sát để khớp mô hình.');

  const meanX = data.reduce((sum, [x]) => sum + x, 0) / data.length;
  const meanY = data.reduce((sum, [, y]) => sum + y, 0) / data.length;
  let covariance = 0;
  let variance = 0;

  for (const [x, y] of data) {
    covariance += (x - meanX) * (y - meanY);
    variance += (x - meanX) ** 2;
  }

  const w = variance === 0 ? 0 : covariance / variance;
  return { w, b: meanY - w * meanX };
}

/** Chuỗi hiển thị phương trình hồi quy, xử lý dấu của hệ số chặn b. */
export function formatEquation(w: number, b: number): string {
  const wText = w.toFixed(3);
  const bAbs = Math.abs(b).toFixed(1);
  const sign = b < 0 ? '-' : '+';
  return `\\hat{y} = ${wText}x ${sign} ${bAbs}`;
}
