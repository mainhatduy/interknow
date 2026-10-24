'use client';

import { useState } from 'react';
import { RegressionPlot } from './RegressionPlot';
import { REGRESSION_DATA, linearPredict } from '@/lib/math/regression';
import { saveLessonProgress } from '@/lib/storage/progress';

export function HousePredictionExplorer() {
  const [area, setArea] = useState(120);
  const price = linearPredict(0.05, 0, area);

  return (
    <div className="border border-line bg-paper p-4 sm:p-5">
      <p className="kicker">Thử ngay · Đổi diện tích căn nhà</p>
      <p className="mb-4 mt-2 text-sm leading-relaxed text-muted">
        Kéo thanh trượt để xem điểm dự đoán di chuyển trên đường thẳng.
      </p>
      <RegressionPlot data={REGRESSION_DATA} w={0.05} b={0} predictionX={area} />
      <div className="mt-5">
        <label htmlFor="house-area" className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span>Diện tích cần dự đoán</span>
          <span className="font-mono font-medium text-accent-ink">{area} m²</span>
        </label>
        <input
          id="house-area"
          type="range"
          min={20}
          max={140}
          step={5}
          value={area}
          onChange={(event) => {
            setArea(Number(event.target.value));
            saveLessonProgress({ lessonId: 'regression', tinkered: true });
          }}
          className="mt-3 w-full cursor-pointer accent-accent"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-muted"><span>20 m²</span><span>140 m²</span></div>
      </div>
      <div className="mt-4 border-t border-line pt-4" aria-live="polite" aria-atomic="true">
        <p className="text-sm text-ink">
          Nhà <strong>{area} m²</strong> → giá dự đoán <strong className="text-accent-ink">{price.toFixed(2)} tỷ VNĐ</strong>
        </p>
        {(area < REGRESSION_DATA[0][0] || area > REGRESSION_DATA[REGRESSION_DATA.length - 1][0]) && (
          <p className="mt-2 text-xs leading-relaxed text-accent-ink">
            Diện tích này nằm ngoài khoảng dữ liệu 40–110 m². Đây là extrapolation (ngoại suy); kết quả có thể kém tin cậy hơn dự đoán trong khoảng đã quan sát.
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Dữ liệu mẫu dao động quanh đường dự đoán: cùng xu hướng tăng theo diện tích nhưng không khớp hoàn toàn. Giá nhà còn phụ thuộc vào vị trí và nhiều yếu tố khác.
        </p>
      </div>
    </div>
  );
}
