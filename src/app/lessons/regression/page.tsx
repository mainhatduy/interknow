'use client';

import React from 'react';
import { LessonLayout, LessonSection } from '@/components/layout/LessonLayout';
import { PredictPrompt } from '@/components/quiz/PredictPrompt';
import { MathFormula } from '@/components/common/MathFormula';
import { CodeBlock } from '@/components/common/CodeBlock';
import { HousePredictionExplorer } from '@/components/simulations/regression/HousePredictionExplorer';
import { LinearRegressionSim } from '@/components/simulations/regression/LinearRegressionSim';
import { RegressionLossExplorer } from '@/components/simulations/regression/RegressionLossExplorer';
import { CheckpointQuiz, QuizQuestion } from '@/components/quiz/CheckpointQuiz';
import { saveLessonProgress } from '@/lib/storage/progress';
import { REGRESSION_DATA, fitLinearRegression, linearPredict, meanSquaredError } from '@/lib/math/regression';

const HOUSE_DATA = REGRESSION_DATA.map(([area, price]) => ({ area, price }));
const FITTED_MODEL = fitLinearRegression(REGRESSION_DATA);

const SYMBOLS = [
  { symbol: 'x', meaning: 'Diện tích nhà (m²)' },
  { symbol: 'y', meaning: 'Giá nhà thực tế' },
  { symbol: '\\hat{y}', meaning: 'Giá nhà mô hình dự đoán' },
  { symbol: 'w', meaning: 'Giá dự đoán tăng bao nhiêu khi diện tích tăng 1 m²' },
  { symbol: 'b', meaning: 'Giá trị dự đoán khi diện tích bằng 0' },
];

const PYTHON_FROM_SCRATCH = `w = 0.05
b = 0
x = 120

y_pred = w * x + b
print("Giá nhà dự đoán:", y_pred, "tỷ VNĐ")`;

const PYTHON_FROM_SCRATCH_OUTPUT = `Giá nhà dự đoán: 6.0 tỷ VNĐ`;

const PYTHON_SKLEARN = `from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X = [${REGRESSION_DATA.map(([area]) => `[${area}]`).join(', ')}]
y = [${REGRESSION_DATA.map(([, price]) => price).join(', ')}]

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[120]])
loss = mean_squared_error(y, model.predict(X))

print(f"Giá dự đoán: {prediction[0]:.2f} tỷ VNĐ")
print(f"MSE trên training data: {loss:.4f}")`;

const PYTHON_SKLEARN_OUTPUT = `Giá dự đoán: ${linearPredict(FITTED_MODEL.w, FITTED_MODEL.b, 120).toFixed(2)} tỷ VNĐ
MSE trên training data: ${meanSquaredError(REGRESSION_DATA, FITTED_MODEL.w, FITTED_MODEL.b).toFixed(4)}`;

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'reg-q1',
    question: 'Cho mô hình ŷ = 2x + 3. Khi x = 5 thì ŷ bằng bao nhiêu?',
    options: ['10', '13', '16', '25'],
    correctIndex: 1,
    explanation: 'Thay x = 5 vào công thức: ŷ = 2·5 + 3 = 10 + 3 = 13.',
  },
  {
    id: 'reg-q2',
    question: 'Trong mô hình giá nhà, w = 0.05 có ý nghĩa gì?',
    options: [
      'Giá nhà luôn bằng 0.05 tỷ',
      'Diện tích tăng 1 m² thì giá dự đoán tăng 0.05 tỷ',
      'Mọi căn nhà đều rộng 0.05 m²',
      'Sai số luôn bằng 0.05',
    ],
    correctIndex: 1,
    explanation:
      'w là hệ số góc (độ dốc): nó cho biết khi x tăng thêm 1 đơn vị (1 m²) thì ŷ tăng thêm w đơn vị (0.05 tỷ VNĐ).',
  },
  {
    id: 'reg-q3',
    question: 'Trong sklearn, lệnh nào giúp mô hình học tham số từ dữ liệu?',
    options: ['model.predict(X)', 'model.fit(X, y)', 'model.print()', 'model.score()'],
    correctIndex: 1,
    explanation:
      'fit(X, y) là bước training: sklearn tự động tìm w và b sao cho dự đoán gần đúng dữ liệu nhất. predict(X) chỉ dùng mô hình đã học để dự đoán.',
  },
  {
    id: 'reg-q4',
    question: 'Trên cùng bộ dữ liệu, mô hình A có MSE = 0.5006, mô hình B có MSE = 0.0406. Theo tiêu chí least squares, chọn mô hình nào?',
    options: [
      'Mô hình A, vì MSE càng lớn càng tốt',
      'Mô hình B, vì trung bình bình phương sai số nhỏ hơn',
      'Hai mô hình giống nhau vì đều là đường thẳng',
      'Không chọn được vì MSE phải bằng 0',
    ],
    correctIndex: 1,
    explanation: 'Mục tiêu là tìm w và b làm MSE nhỏ nhất trên cùng bộ dữ liệu. Mô hình B đạt tiêu chí này tốt hơn; dữ liệu có độ phân tán nên không cần MSE bằng 0.',
  },
  {
    id: 'reg-q5',
    question: 'MSE trên training data rất nhỏ. Cần làm gì để biết mô hình dự đoán tốt cho nhà chưa gặp?',
    options: [
      'Kết luận ngay rằng mọi dự đoán đều chính xác',
      'Tiếp tục đo lại trên đúng các căn nhà đã dùng để học',
      'Đánh giá trên dữ liệu có giá đã biết nhưng không dùng để học tham số',
      'Chọn giá trị w lớn hơn',
    ],
    correctIndex: 2,
    explanation: 'Test data được giữ riêng để đánh giá dự đoán mới. Sai số nhỏ trên training data chưa đảm bảo sai số nhỏ trên các quan sát chưa gặp.',
  },
];

export default function RegressionPage() {
  const handleCompleteLesson = () => {
    saveLessonProgress({ lessonId: 'regression', completed: true });
  };

  const sections: LessonSection[] = [
    {
      id: 'ban-chat', label: 'Bản chất', title: 'Khái niệm hồi quy',
      content: (
        <>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            Giả sử bạn muốn dự đoán giá nhà dựa vào diện tích.
          </p>

          <div className="my-5 overflow-x-auto border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-line-strong text-left">
                  <th className="px-4 py-2.5 font-medium text-ink">Diện tích (m²)</th>
                  <th className="px-4 py-2.5 font-medium text-ink">Giá nhà (tỷ VNĐ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {HOUSE_DATA.map((row) => (
                  <tr key={row.area}>
                    <td className="px-4 py-2 font-mono text-muted">{row.area}</td>
                    <td className="px-4 py-2 font-mono text-muted">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm leading-relaxed text-ink">
            Giá nhà có xu hướng tăng theo diện tích, nhưng mức tăng không cố định.
            Chẳng hạn, căn nhà 80 m² có giá 4.3 tỷ, còn căn nhà 100 m² có giá 4.8 tỷ.
            Dữ liệu mẫu có độ phân tán nhẹ để mô phỏng sự khác biệt thường gặp trong thực tế.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            <strong>Regression</strong> (hồi quy) là phương pháp học từ những dữ liệu đã có để dự
            đoán một giá trị số, chẳng hạn giá nhà, doanh thu hay nhiệt độ.
            Đây là supervised learning (học có giám sát): mỗi mẫu dùng để học đã có cả diện tích đầu vào và giá quan sát.
          </p>

          <div className="my-6">
            <HousePredictionExplorer />
          </div>

          <p className="text-xs leading-relaxed text-muted">
            Chấm xanh là dữ liệu mẫu. Chấm vàng là giá dự đoán cho diện tích bạn chọn.
            Các điểm nằm ở cả hai phía của đường thẳng; mô hình biểu diễn xu hướng chung
            thay vì đi qua chính xác từng điểm.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            Khi chỉ dùng một đầu vào như diện tích, mô hình được gọi là <strong>Simple Linear Regression</strong>.
          </p>

        </>
      ),
    },
    {
      id: 'cong-thuc', label: 'Công thức', title: 'Mô hình hồi quy tuyến tính đơn',
      content: (
        <>

          <div className="my-5 border border-line bg-accent-soft/40 py-3 text-center">
            <MathFormula math="\boxed{\hat{y} = wx + b}" block />
          </div>

          <p className="text-sm leading-relaxed text-ink">
            Mô hình nhân diện tích với hệ số w, rồi cộng hệ số b để tạo ra giá dự đoán.
          </p>

          <div className="my-5 overflow-x-auto border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-line-strong text-left">
                  <th className="px-4 py-2.5 font-medium text-ink">Ký hiệu</th>
                  <th className="px-4 py-2.5 font-medium text-ink">Ý nghĩa trong bài toán giá nhà</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SYMBOLS.map((row) => (
                  <tr key={row.symbol}>
                    <td className="px-4 py-2">
                      <MathFormula math={row.symbol} />
                    </td>
                    <td className="px-4 py-2 text-muted">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm leading-relaxed text-ink">Một mô hình mô tả xu hướng của bộ dữ liệu trên là:</p>

          <MathFormula math="\hat{y} = 0.05x + 0" block />

          <p className="text-sm leading-relaxed text-ink">
            Tức là <MathFormula math="w = 0.05" /> và <MathFormula math="b = 0" />, với đơn vị giá
            là tỷ VNĐ.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            w và b là các tham số được học từ dữ liệu. b giúp dịch chuyển đường thẳng;
            không nên diễn giải nó thành giá của căn nhà 0 m², vốn nằm ngoài dữ liệu đang xét.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink">Nếu nhà có diện tích 80 m²:</p>

          <MathFormula math="\hat{y} = 0.05 \times 80 = 4" block />

          <p className="text-sm leading-relaxed text-ink">
            Mô hình dự đoán giá nhà là 4 tỷ VNĐ, trong khi giá ghi nhận trong bộ dữ liệu là
            4.3 tỷ VNĐ. Chênh lệch 0.3 tỷ VNĐ là residual (phần dư) của quan sát này.
          </p>

          <div className="mt-6">
            <PredictPrompt
              question="Giữ w = 0.05 và b = 0. Theo bạn, căn nhà 120 m² sẽ có giá dự đoán bao nhiêu?"
              options={[
                { text: '4 tỷ VNĐ', explanation: '4 tỷ là giá dự đoán cho 80 m². Với 120 m², hãy tính 0.05 × 120 = 6 tỷ.' },
                { text: '6 tỷ VNĐ', explanation: 'Đúng rồi: ŷ = 0.05 × 120 + 0 = 6 tỷ VNĐ. Bạn vừa dùng mô hình để dự đoán một đầu vào mới.' },
                { text: '120 tỷ VNĐ', explanation: '120 là diện tích đầu vào x, chưa phải giá dự đoán. Cần nhân với w = 0.05 rồi cộng b = 0, được 6 tỷ.' },
              ]}
              onAnswered={() => saveLessonProgress({ lessonId: 'regression', predictionAnswered: true })}
            />
          </div>

        </>
      ),
    },
    {
      id: 'ham-mat-mat', label: 'Loss function', title: 'Loss function và mục tiêu tối ưu',
      content: (
        <div className="space-y-5 text-sm leading-relaxed">
          <p>
            Công thức cho ta một dự đoán. Để chọn giữa các đường thẳng, cần một cách đo
            mức chênh lệch giữa dự đoán và giá quan sát.
          </p>
          <div>
            <h3 className="font-serif text-lg font-semibold">Residual của một quan sát</h3>
            <p className="mt-2">Residual được tính bằng giá quan sát trừ giá dự đoán:</p>
            <MathFormula math="e_i = y_i - \hat{y}_i" block />
            <p>
              Với nhà 80 m², giá quan sát là 4.3 tỷ và giá dự đoán là 4 tỷ: residual bằng 0.3 tỷ.
              Dấu dương cho biết mô hình dự đoán thấp hơn giá quan sát; dấu âm cho biết dự đoán cao hơn.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Squared error</h3>
            <p className="mt-2">
              Squared error là bình phương của residual. Hai residual +1 và −1 cộng lại bằng 0, dù cả hai dự đoán đều sai.
              Bình phương biến chúng thành 1 và 1, nên không triệt tiêu nhau.
              Sai lệch lớn cũng bị tính nặng hơn: sai 2 đơn vị đóng góp 4, sai 1 đơn vị đóng góp 1.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">MSE loss</h3>
            <p className="mt-2">
              Lấy trung bình các squared error của n quan sát, ta được MSE
              (Mean Squared Error). Bài này dùng MSE làm <strong>loss function</strong> (hàm mất mát), ký hiệu L:
            </p>
            <MathFormula math="L(w,b) = \mathrm{MSE} = \frac{1}{n}\sum_{i=1}^{n}\left[y_i - (wx_i + b)\right]^2" block />
            <p>Đọc công thức theo ba bước: tính residual cho mỗi căn nhà → bình phương → lấy trung bình.</p>
          </div>

          <RegressionLossExplorer />

          <div className="border-l-2 border-accent bg-accent-soft/40 p-4 sm:p-5">
            <h3 className="font-serif text-lg font-semibold">Objective function</h3>
            <p className="mt-2">
              Training data là dữ liệu dùng để học w và b. Training là tìm hai tham số này để L nhỏ nhất.
              Trong bài này, loss function cũng là objective function (hàm mục tiêu) cần tối thiểu hóa:
            </p>
            <MathFormula math="\min_{w,b} L(w,b)" block />
            <p>
              Cách chọn đường thẳng này gọi là <strong>least squares</strong> (bình phương tối thiểu).
              Ta tìm sai số tổng thể nhỏ nhất, không bắt buộc đường thẳng đi qua từng điểm.
            </p>
          </div>
          <details className="text-xs text-muted">
            <summary className="cursor-pointer text-accent-ink">Đối chiếu với bài tham khảo</summary>
            <p className="mt-2">
              Bài tham khảo dùng một nửa tổng bình phương sai số; bài này dùng trung bình (MSE).
              Với cùng bộ dữ liệu, hai cách chỉ khác một hệ số dương cố định và cho cùng tham số tối ưu.
            </p>
          </details>
        </div>
      ),
    },
    {
      id: 'thuc-hanh', label: 'Thực hành', title: 'Ảnh hưởng của các tham số w và b',
      content: (
        <>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            Mô hình bên dưới bắt đầu với w = 0.03 và b = 1, nên chưa khớp dữ liệu.
            Giữ b cố định và đổi w, rồi làm ngược lại. Quan sát residual và MSE thay đổi;
            sau đó bấm “Fit model” để so sánh với kết quả least squares.
          </p>

          <div className="my-6">
            <LinearRegressionSim />
          </div>

          <p className="text-sm leading-relaxed text-ink">
            Thử chỉnh <MathFormula math="w" /> và <MathFormula math="b" /> sao cho đường thẳng
            mô tả tốt xu hướng của các điểm. MSE càng thấp thì sai số bình phương trung bình
            trên dữ liệu này càng nhỏ. Với dữ liệu có độ phân tán, MSE nhỏ nhất vẫn có thể
            lớn hơn 0; không có đường thẳng nào đi qua toàn bộ các điểm trong ví dụ này.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            Nút “Fit model” tìm tham số từ dữ liệu, cùng mục tiêu với lệnh{' '}
            <code className="font-mono">fit(X, y)</code> trong phần Python bên dưới.
            Với bộ dữ liệu này, w ≈ 0.05, b ≈ 0 và MSE nhỏ nhất ≈ 0.0406.
          </p>

        </>
      ),
    },
    {
      id: 'python', label: 'Python', title: 'Triển khai mô hình bằng Python',
      content: (
        <>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            Tính giá dự đoán từ công thức:
          </p>

          <div className="my-4">
            <CodeBlock code={PYTHON_FROM_SCRATCH} />
          </div>

          <div className="my-3">
            <CodeBlock code={PYTHON_FROM_SCRATCH_OUTPUT} language="text" />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink">
            Với <code className="font-mono text-sm">scikit-learn</code>,{' '}
            <code className="font-mono text-sm">fit(X, y)</code> ước lượng w và b từ dữ liệu:
          </p>

          <div className="my-4">
            <CodeBlock code={PYTHON_SKLEARN} />
          </div>

          <div className="my-3">
            <CodeBlock code={PYTHON_SKLEARN_OUTPUT} language="text" />
          </div>
          <p className="text-sm leading-relaxed text-muted">
            <code className="font-mono">mean_squared_error</code> tính đúng MSE đã dùng trong mô phỏng.
            Ở đây MSE được đo trên training data; phần tiếp theo phân biệt nó với đánh giá trên dữ liệu mới.
          </p>

          <p className="mt-6 text-sm text-ink">Ghi nhớ ba lệnh quan trọng:</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
            <li className="flex gap-2">
              <span className="text-accent-ink">•</span>
              <span>
                <code className="font-mono text-sm">LinearRegression()</code> tạo mô hình.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-ink">•</span>
              <span>
                <code className="font-mono text-sm">fit(X, y)</code> học tham số từ dữ liệu.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-ink">•</span>
              <span>
                <code className="font-mono text-sm">predict(X_new)</code> sử dụng mô hình đã học
                để dự đoán.
              </span>
            </li>
          </ul>

          <div className="mt-6 border-l-2 border-accent bg-accent-soft/40 p-4 text-sm leading-relaxed text-ink">
            <strong>Lưu ý:</strong> <code className="font-mono text-sm">X</code> là danh sách hai
            chiều vì sklearn yêu cầu mỗi mẫu có một danh sách các đặc trưng. Ở đây mỗi căn nhà
            chỉ có một đặc trưng là diện tích.
          </div>

        </>
      ),
    },
    {
      id: 'danh-gia', label: 'Đánh giá', title: 'Đánh giá và phạm vi áp dụng',
      content: (
        <div className="space-y-5 text-sm leading-relaxed">
          <div>
            <h3 className="font-serif text-lg font-semibold">Training data và test data</h3>
            <p className="mt-2">
              Training data dùng để tìm w và b. Test data là phần dữ liệu giữ riêng,
              không dùng khi fit model. Ta so sánh dự đoán trên test data với giá quan sát để đánh giá mô hình.
              MSE nhỏ trên training data chưa đảm bảo dự đoán tốt trên test data.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Điều kiện áp dụng</h3>
            <p className="mt-2">
              Mô hình này hữu ích khi dữ liệu có xu hướng gần thẳng. Nếu các điểm tạo thành
              một đường cong rõ rệt, chỉ điều chỉnh w và b sẽ không mô tả tốt mối quan hệ đó.
              Một vài outlier (quan sát khác biệt rõ rệt) cũng có thể kéo lệch đường hồi quy vì sai số được bình phương.
              Cần kiểm tra nguyên nhân của chúng trước khi quyết định cách xử lý.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Giới hạn của ví dụ giá nhà</h3>
            <p className="mt-2">
              Bộ dữ liệu mẫu chỉ có diện tích từ 40 đến 110 m². Dự đoán cho 120 m² là
              <strong> extrapolation</strong>: áp dụng mô hình ra ngoài khoảng đã quan sát.
              Giá nhà còn phụ thuộc vào vị trí, tình trạng và nhiều yếu tố khác.
              Mối liên hệ trong dữ liệu không chứng minh rằng diện tích là nguyên nhân duy nhất quyết định giá.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'kiem-tra', label: 'Kiểm tra', title: 'Bài tập củng cố',
      content: (
        <>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Trả lời năm câu về mô hình, loss function và cách đánh giá. Mỗi câu có lời giải thích sau khi nộp.
          </p>

          <div className="mt-6">
            <CheckpointQuiz
              lessonId="regression"
              title="Bài tập kiểm tra"
              questions={QUIZ_QUESTIONS}
              onCompleteLesson={handleCompleteLesson}
            />
          </div>

        </>
      ),
    },
  ];

  return (
    <LessonLayout
      lessonId="regression"
      category="Machine Learning · Regression"
      title="Hồi quy tuyến tính đơn"
      duration="25–35"
      sections={sections}
      summary={
        <>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Mô hình <MathFormula math="\hat{y} = wx + b" /> tạo ra dự đoán.
            MSE loss đo trung bình các squared error.
            Training tìm w và b để MSE nhỏ nhất trên training data;
            test data cho biết mô hình dự đoán các quan sát chưa gặp ra sao.
          </p>
          <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-muted">
            Tham khảo:{' '}
            <a href="https://machinelearningcoban.com/2016/12/28/linearregression/" target="_blank" rel="noopener noreferrer" className="text-accent-ink underline underline-offset-4">Linear Regression — Machine Learning cơ bản</a>
            {' · '}
            <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html" target="_blank" rel="noopener noreferrer" className="text-accent-ink underline underline-offset-4">MSE trong scikit-learn</a>
          </p>

        </>
      }
    />
  );
}
