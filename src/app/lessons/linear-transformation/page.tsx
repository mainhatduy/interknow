'use client';

import React from 'react';
import { LessonLayout, LessonSection } from '@/components/layout/LessonLayout';
import { LinearTransformSim } from '@/components/simulations/linear-transformation/LinearTransformSim';
import { PredictPrompt } from '@/components/quiz/PredictPrompt';
import { CheckpointQuiz, QuizQuestion } from '@/components/quiz/CheckpointQuiz';
import { MathFormula } from '@/components/common/MathFormula';
import { saveLessonProgress } from '@/lib/storage/progress';

const PREDICT_OPTIONS = [
  {
    text: 'Toàn bộ mặt phẳng 2D bị ép dẹp thành một đường thẳng duy nhất (hoặc 1 điểm), làm mất đi 1 chiều không gian.',
    explanation: 'Chính xác! det(A) đo tỉ lệ diện tích. Khi det(A) = 0, diện tích hình bình hành đơn vị co về 0, không gian 2D suy biến về 1D.',
  },
  {
    text: 'Mặt phẳng chỉ bị quay đi 90 độ và diện tích không đổi.',
    explanation: 'Sai! Phép quay có định thức det(A) = 1 (bảo toàn diện tích). Khi det = 0, toàn bộ diện tích bị triệt tiêu.',
  },
  {
    text: 'Các vector chỉ đổi màu trên màn hình mà lưới không gian không biến dạng.',
    explanation: 'Sai! Ma trận det = 0 gây ra hiệu ứng bẹp không gian rõ rệt nhất trong hình học tuyến tính.',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'lt-q1',
    question: 'Tại sao chỉ cần biết vector đích của î và ĵ là ta có thể biết nơi đáp xuống của MỌI vector v = [x, y]ᵀ?',
    options: [
      'Vì mọi vector [x, y]ᵀ đều là tổ hợp tuyến tính v = x·î + y·ĵ, do đó vị trí mới là x·(Aî) + y·(Aĵ)',
      'Vì máy tính tự động nội suy ngẫu nhiên',
      'Vì î và ĵ luôn dài 1 đơn vị',
      'Chỉ áp dụng được cho số nguyên, không áp dụng được cho số thực',
    ],
    correctIndex: 0,
    explanation:
      'Tính chất cốt lõi của biến đổi tuyến tính: bảo toàn phép cộng vector và phép nhân với vô hướng. Mọi điểm trên mặt phẳng đều theo sau 2 vector cơ sở.',
  },
  {
    id: 'lt-q2',
    question: 'Ý nghĩa hình học trực quan nhất của Định thức det(A) là gì?',
    options: [
      'Tổng độ dài hai đường chéo của ma trận',
      'Hệ số co giãn diện tích của bất kỳ hình nào trên mặt phẳng sau phép biến đổi',
      'Số chiều của ma trận',
      'Số lượng bước thuật toán cần chạy',
    ],
    correctIndex: 1,
    explanation:
      'Nếu một hình ban đầu có diện tích là 5, sau biến đổi bởi ma trận A, diện tích mới của nó chắc chắn sẽ là 5 × |det(A)|.',
  },
  {
    id: 'lt-q3',
    question: 'Tại sao ma trận có det(A) = 0 KHÔNG THỂ có ma trận nghịch đảo A⁻¹?',
    options: [
      'Vì không gian 2D đã bị nén thành 1 đường thẳng (1D), vô số điểm ban đầu bị gộp chung vào 1 điểm nên không thể khôi phục ngược lại duy nhất',
      'Vì số 0 không thể viết vào bộ nhớ máy tính',
      'Vì ma trận nghịch đảo chỉ tồn tại cho ma trận 3x3 trở lên',
      'Vẫn có nghịch đảo bình thường nếu nhân với số âm',
    ],
    correctIndex: 0,
    explanation:
      'Khi det = 0, thông tin bị mất mát vĩnh viễn (nhiều điểm chập thành một điểm). Không thể có hàm toán học nào bung ngược 1 đường thẳng 1D trở lại mặt phẳng 2D nguyên bản.',
  },
];

export default function LinearTransformationPage() {
  const handleCompleteLesson = () => {
    saveLessonProgress({ lessonId: 'linear-transformation', completed: true });
  };

  const sections: LessonSection[] = [
    {
      id: 'ban-chat', label: 'Bản chất', title: 'Ma trận và biến đổi tuyến tính',
      content: <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Đừng nhìn ma trận như một bảng chứa 4 con số vô hồn. Hãy nhìn nó như một <strong>cỗ máy nhào nặn không gian</strong>.
          </p>

          <p>
            Biến đổi tuyến tính giữ cho gốc tọa độ <MathFormula math="(0,0)" /> đứng yên, và các đường lưới song song vẫn giữ thẳng và cách đều nhau.
          </p>

          <p>
            Vì vậy, toàn bộ sự biến dạng của toàn bộ không gian 2D được quyết định 100% bởi nơi mà 2 vector cơ sở đơn vị đáp xuống:
          </p>

          <div className="border-l-2 border-accent bg-accent-soft/50 p-4">
            <MathFormula
              math="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \implies A\hat{i} = \begin{bmatrix} a \\ c \end{bmatrix}, \quad A\hat{j} = \begin{bmatrix} b \\ d \end{bmatrix}"
              block
            />
            <p className="text-[11px] text-muted text-center">
              Cột thứ nhất là tọa độ mới của <MathFormula math="\hat{i}" />, Cột thứ hai là tọa độ mới của <MathFormula math="\hat{j}" />!
            </p>
          </div>

          <p>
            <strong>Định thức <MathFormula math="\det(A) = ad - bc" />:</strong> Đo lường tỉ lệ thay đổi diện tích của hình bình hành đơn vị. Nếu <MathFormula math="\det(A) = 2" />, diện tích phóng to gấp đôi. Nếu <MathFormula math="\det(A) < 0" />, không gian bị lật ngược (như nhìn vào gương).
          </p>
      </div>,
    },
    {
      id: 'du-doan', label: 'Dự đoán', title: 'Dự đoán kết quả',
      content: (
      <PredictPrompt
        question="Nếu một ma trận biến đổi có định thức det(A) = 0 (ví dụ preset Suy biến), bạn dự đoán điều gì sẽ xảy ra với hình bình hành diện tích và lưới không gian?"
        options={PREDICT_OPTIONS}
        onAnswered={() => {
          saveLessonProgress({ lessonId: 'linear-transformation', predictionAnswered: true });
        }}
      />
      ),
    },
    {
      id: 'thuc-hanh', label: 'Thực hành', title: 'Mô phỏng biến đổi tuyến tính trong mặt phẳng',
      content: (
        <div className="space-y-5">
          <div className="border-l-2 border-accent bg-accent-soft/40 p-4 sm:p-5">
            <p className="kicker">Bạn hãy thử</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                  <li>Chọn một phép biến đổi mẫu và bấm “Xem biến hình” để theo dõi hai vector cơ sở.</li>
                  <li>Kéo tiến trình từ 0 đến 1. Quan sát hình vuông đơn vị và giá trị định thức.</li>
                  <li>Chọn “Suy biến”, rồi thử thay đổi từng phần tử của ma trận. Tìm lúc diện tích bằng 0.</li>
            </ol>
          </div>
          <LinearTransformSim />
        </div>
      ),
    },
    {
      id: 'nhan-xet', label: 'Nhận xét', title: 'Vector cơ sở và ý nghĩa hình học của định thức',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
              <p>Mọi vector đều viết được dưới dạng <MathFormula math="v = x\hat{i} + y\hat{j}" />. Vì biến đổi tuyến tính bảo toàn phép cộng và phép nhân với số, ta có:</p>
              <MathFormula math="Av = x(A\hat{i}) + y(A\hat{j})" block />
              <p>Vì vậy, biết hai vector cơ sở đi đâu là đủ để xác định vị trí mới của mọi điểm.</p>
              <p><strong>Giá trị tuyệt đối của định thức</strong> là hệ số thay đổi diện tích. Định thức âm còn cho biết hướng bị đảo ngược.</p>
              <p>Khi định thức bằng 0, mặt phẳng bị ép về một đường thẳng hoặc một điểm. Nhiều điểm ban đầu trùng nhau sau biến đổi, nên không thể khôi phục duy nhất bằng ma trận nghịch đảo.</p>
        </div>
      ),
    },
    {
      id: 'kiem-tra', label: 'Kiểm tra', title: 'Bài tập củng cố',
      content: (
        <>
          <p className="mb-5 text-sm leading-relaxed text-muted">Trả lời ba câu hỏi để đối chiếu với những gì bạn vừa quan sát. Sau khi nộp, mỗi câu đều có lời giải thích.</p>
      <CheckpointQuiz
        lessonId="linear-transformation"
        questions={QUIZ_QUESTIONS}
        onCompleteLesson={handleCompleteLesson}
      />
        </>
      ),
    },
  ];

  return (
    <LessonLayout
      lessonId="linear-transformation"
      category="Đại số tuyến tính"
      title="Biến đổi tuyến tính và định thức"
      duration="15–20"
      sections={sections}
      summary={<p>Hai cột của ma trận cho biết vị trí mới của î và ĵ. |det(A)| đo hệ số thay đổi diện tích; dấu âm biểu thị đảo hướng. det(A) = 0 làm mất chiều và ma trận không có nghịch đảo.</p>}
    />
  );
}
