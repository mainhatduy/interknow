'use client';

import React from 'react';
import { LessonLayout, LessonSection } from '@/components/layout/LessonLayout';
import { DerivativeSim } from '@/components/simulations/derivative/DerivativeSim';
import { PredictPrompt } from '@/components/quiz/PredictPrompt';
import { CheckpointQuiz, QuizQuestion } from '@/components/quiz/CheckpointQuiz';
import { MathFormula } from '@/components/common/MathFormula';
import { saveLessonProgress } from '@/lib/storage/progress';

const PREDICT_OPTIONS = [
  {
    text: 'Đường cát tuyến sẽ xoay dần và tiến tới trùng khít hoàn hảo với đường tiếp tuyến nét đứt.',
    explanation: 'Chính xác! Đạo hàm chính là giới hạn hình học của cát tuyến khi khoảng cách 2 điểm co về 0.',
  },
  {
    text: 'Đường cát tuyến sẽ biến mất hoàn toàn vì chia cho 0 gây lỗi vô định.',
    explanation: 'Sai! Mặc dù chia cho 0 bị cấm trong số học thông thường, nhưng phép lấy giới hạn (Limit) cho phép ta khảo sát xu hướng tiến tới khi deltaX tiến sát 0.',
  },
  {
    text: 'Hệ số góc của cát tuyến không thay đổi vì đồ thị là cố định.',
    explanation: 'Sai! Vì đường cong bị uốn lượn, độ dốc nối 2 điểm khác nhau liên tục thay đổi theo vị trí của điểm B.',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'der-q1',
    question: 'Ý nghĩa hình học trực quan nhất của đạo hàm f\'(x₀) là gì?',
    options: [
      'Diện tích vùng dưới đường cong tại điểm x₀',
      'Độ dốc (hệ số góc) của đường tiếp tuyến với đồ thị hàm số tại điểm (x₀, f(x₀))',
      'Khoảng cách từ điểm đó tới gốc tọa độ (0, 0)',
      'Giá trị lớn nhất mà hàm số có thể đạt được',
    ],
    correctIndex: 1,
    explanation:
      'Đạo hàm tại một điểm chính là hệ số góc (slope) của tiếp tuyến tại điểm đó — cho biết hàm số đang tăng, giảm hay đi ngang nhanh mức nào.',
  },
  {
    id: 'der-q2',
    question: 'Tại điểm cực trị (đỉnh cao nhất hoặc đáy thấp nhất) của parabol, đạo hàm f\'(x) bằng bao nhiêu?',
    options: [
      'Bằng vô cùng (tiếp tuyến dựng đứng)',
      'Bằng 0 (tiếp tuyến nằm ngang hoàn toàn)',
      'Bằng 1 (góc nghiêng 45 độ)',
      'Không thể xác định được',
    ],
    correctIndex: 1,
    explanation:
      'Tại đỉnh hoặc đáy, đồ thị chuyển từ tăng sang giảm (hoặc ngược lại). Tốc độ thay đổi tức thời bằng 0, tiếp tuyến nằm ngang song song trục hoành (f\'(x) = 0).',
  },
  {
    id: 'der-q3',
    question: 'Vì sao trong vi tích phân cần dùng khái niệm Giới hạn (Limit) khi Δx → 0 thay vì thay trực tiếp Δx = 0?',
    options: [
      'Vì thay trực tiếp Δx = 0 dẫn tới dạng vô định 0/0 không có nghĩa trong số học thông thường',
      'Vì máy tính không thể lưu số 0',
      'Để làm cho công thức toán trông phức tạp hơn',
      'Vì hàm số sẽ bị triệt tiêu thành 0',
    ],
    correctIndex: 0,
    explanation:
      'Khi Δx = 0, Δy cũng bằng 0, dẫn tới dạng vô định 0/0. Phép lấy giới hạn lim(Δx → 0) giải quyết bài toán này bằng cách xét xu hướng tiệm cận khi khoảng cách nhỏ tùy ý.',
  },
];

export default function DerivativePage() {
  const handleCompleteLesson = () => {
    saveLessonProgress({ lessonId: 'derivative', completed: true });
  };

  const sections: LessonSection[] = [
    {
      id: 'ban-chat', label: 'Bản chất', title: 'Tốc độ thay đổi trung bình và tức thời',
      content: <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Nếu bạn đi xe từ Hà Nội vào Hải Phòng hết 2 giờ cho 120km, vận tốc trung bình của bạn là 60 km/h. Nhưng đồng hồ tốc độ (công-tơ-mét) trên xe lúc 8h15 sáng hiển thị bao nhiêu? Đó là <strong>vận tốc tức thời</strong>.
          </p>

          <p>
            Hình học hóa ý niệm này: Đường nối 2 điểm phân biệt <MathFormula math="A(x_0, f(x_0))" /> và <MathFormula math="B(x_0+\Delta x, f(x_0+\Delta x))" /> là một <strong>Cát tuyến (Secant line)</strong> với độ dốc:
          </p>

          <MathFormula
            math="m_{\text{cát tuyến}} = \frac{\Delta y}{\Delta x} = \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}"
            block
          />

          <p>
            Khi ta kéo điểm <MathFormula math="B" /> trượt trên đường cong tiến vô cùng gần điểm <MathFormula math="A" /> (<MathFormula math="\Delta x \to 0" />), cát tuyến này sẽ xoay dần và trở thành <strong>Tiếp tuyến (Tangent line)</strong> tại điểm <MathFormula math="A" />:
          </p>

          <div className="border-l-2 border-accent bg-accent-soft/50 p-4">
            <p className="text-xs font-medium text-accent-ink">
              Định nghĩa Đạo hàm vi tích phân:
            </p>
            <MathFormula
              math="f'(x_0) = \lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}"
              block
            />
          </div>
      </div>,
    },
    {
      id: 'du-doan', label: 'Dự đoán', title: 'Dự đoán kết quả',
      content: (
      <PredictPrompt
        question="Khi bạn kéo thanh trượt Δx từ 2.0 giảm dần về sát 0, điều gì sẽ xảy ra với đường cát tuyến màu cam so với tiếp tuyến nét đứt?"
        options={PREDICT_OPTIONS}
        onAnswered={() => {
          saveLessonProgress({ lessonId: 'derivative', predictionAnswered: true });
        }}
      />
      ),
    },
    {
      id: 'thuc-hanh', label: 'Thực hành', title: 'Mô phỏng giới hạn của hệ số góc cát tuyến',
      content: (
        <div className="space-y-5">
          <div className="border-l-2 border-accent bg-accent-soft/40 p-4 sm:p-5">
            <p className="kicker">Bạn hãy thử</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                  <li>Chọn “Parabol”, giữ nguyên x₀ và giảm dần Δx bằng thanh trượt.</li>
                  <li>Bấm Δx → 0. So sánh độ dốc cát tuyến với độ dốc tiếp tuyến.</li>
                  <li>Đưa x₀ về 1, rồi sang hai phía của đỉnh parabol. Quan sát dấu của đạo hàm.</li>
            </ol>
          </div>
          <DerivativeSim />
        </div>
      ),
    },
    {
      id: 'nhan-xet', label: 'Nhận xét', title: 'Ý nghĩa hình học của đạo hàm',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
              <p>Với parabol trong mô phỏng, <MathFormula math="f(x) = 0.4x^2 - 0.8x + 1.2" />, độ dốc cát tuyến là:</p>
              <MathFormula math="m = 0.8x_0 - 0.8 + 0.4\Delta x" block />
              <p>Khi Δx tiến về 0, phần chênh lệch 0.4Δx biến mất và độ dốc tiến về <MathFormula math="f'(x_0) = 0.8x_0 - 0.8" />. Đó là con số mà tiếp tuyến biểu diễn.</p>
              <p>Bên trái đỉnh x₀ = 1, đạo hàm âm: hàm đang giảm. Bên phải đỉnh, đạo hàm dương: hàm đang tăng. Tại đỉnh, đạo hàm bằng 0 và tiếp tuyến nằm ngang.</p>
              <p>Ta xét Δx <strong>tiến về</strong> 0 vì thay trực tiếp bằng 0 sẽ tạo ra phép chia 0/0.</p>
        </div>
      ),
    },
    {
      id: 'kiem-tra', label: 'Kiểm tra', title: 'Bài tập củng cố',
      content: (
        <>
          <p className="mb-5 text-sm leading-relaxed text-muted">Trả lời ba câu hỏi để đối chiếu với những gì bạn vừa quan sát. Sau khi nộp, mỗi câu đều có lời giải thích.</p>
      <CheckpointQuiz
        lessonId="derivative"
        questions={QUIZ_QUESTIONS}
        onCompleteLesson={handleCompleteLesson}
      />
        </>
      ),
    },
  ];

  return (
    <LessonLayout
      lessonId="derivative"
      category="Giải tích & Vi phân"
      title="Đạo hàm và tiếp tuyến"
      duration="15–20"
      sections={sections}
      summary={<p>Cát tuyến đo độ dốc giữa hai điểm. Khi hai điểm tiến sát nhau, độ dốc tiến đến đạo hàm tại điểm đang xét. Dấu của đạo hàm cho biết hàm đang tăng hay giảm; độ lớn cho biết mức độ thay đổi.</p>}
    />
  );
}
