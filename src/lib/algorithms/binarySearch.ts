export interface BinarySearchStep {
  stepIndex: number;
  low: number;
  high: number;
  mid: number;
  target: number;
  currentVal: number | null;
  status: 'init' | 'check' | 'found' | 'narrow-left' | 'narrow-right' | 'not-found';
  description: string;
  eliminatedIndices: number[];
  codeLine: number; // 1-indexed line of algorithm pseudocode
}

export function generateBinarySearchSteps(
  arr: number[],
  target: number
): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
  const n = arr.length;

  if (n === 0) {
    steps.push({
      stepIndex: 0,
      low: 0,
      high: -1,
      mid: -1,
      target,
      currentVal: null,
      status: 'not-found',
      description: 'Mảng rỗng, không tìm thấy mục tiêu.',
      eliminatedIndices: [],
      codeLine: 7,
    });
    return steps;
  }

  let low = 0;
  let high = n - 1;
  let stepIndex = 0;
  const eliminated = new Set<number>();

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    low,
    high,
    mid: Math.floor((low + high) / 2),
    target,
    currentVal: null,
    status: 'init',
    description: `Khởi tạo: Tìm kiếm ${target} trên toàn bộ mảng từ chỉ số [${low} .. ${high}].`,
    eliminatedIndices: [],
    codeLine: 1,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    // Check mid step
    steps.push({
      stepIndex: stepIndex++,
      low,
      high,
      mid,
      target,
      currentVal: midVal,
      status: 'check',
      description: `Tính mid = floor((${low} + ${high}) / 2) = ${mid}. So sánh arr[${mid}] = ${midVal} với ${target}.`,
      eliminatedIndices: Array.from(eliminated),
      codeLine: 3,
    });

    if (midVal === target) {
      steps.push({
        stepIndex: stepIndex++,
        low,
        high,
        mid,
        target,
        currentVal: midVal,
        status: 'found',
        description: `CHÍNH XÁC! Tìm thấy ${target} tại chỉ số ${mid} sau ${steps.length} bước.`,
        eliminatedIndices: Array.from(eliminated),
        codeLine: 4,
      });
      return steps;
    }

    if (midVal < target) {
      // Eliminate left side including mid
      for (let i = low; i <= mid; i++) {
        eliminated.add(i);
      }
      steps.push({
        stepIndex: stepIndex++,
        low,
        high,
        mid,
        target,
        currentVal: midVal,
        status: 'narrow-right',
        description: `Vì ${midVal} < ${target}, nên ${target} chỉ có thể nằm ở nửa phải. Cập nhật low = ${mid + 1}. Loại bỏ nửa trái.`,
        eliminatedIndices: Array.from(eliminated),
        codeLine: 5,
      });
      low = mid + 1;
    } else {
      // Eliminate right side including mid
      for (let i = mid; i <= high; i++) {
        eliminated.add(i);
      }
      steps.push({
        stepIndex: stepIndex++,
        low,
        high,
        mid,
        target,
        currentVal: midVal,
        status: 'narrow-left',
        description: `Vì ${midVal} > ${target}, nên ${target} chỉ có thể nằm ở nửa trái. Cập nhật high = ${mid - 1}. Loại bỏ nửa phải.`,
        eliminatedIndices: Array.from(eliminated),
        codeLine: 6,
      });
      high = mid - 1;
    }
  }

  // Not found step
  steps.push({
    stepIndex: stepIndex++,
    low,
    high,
    mid: -1,
    target,
    currentVal: null,
    status: 'not-found',
    description: `Kết thúc: low (${low}) > high (${high}). Không tìm thấy ${target} trong mảng đã sắp xếp.`,
    eliminatedIndices: Array.from(eliminated),
    codeLine: 7,
  });

  return steps;
}

export const BINARY_SEARCH_CODE = `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;   // [Line 1]
  while (low <= high) {                // [Line 2]
    const mid = Math.floor((low + high) / 2); // [Line 3]
    if (arr[mid] === target) return mid;      // [Line 4]
    if (arr[mid] < target) {                  // [Line 5]
      low = mid + 1;
    } else {                                  // [Line 6]
      high = mid - 1;
    }
  }
  return -1; // Not found                     // [Line 7]
}`;
