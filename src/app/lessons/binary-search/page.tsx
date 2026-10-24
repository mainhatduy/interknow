'use client';

import React from 'react';
import { LessonLayout, LessonSection } from '@/components/layout/LessonLayout';
import { BinarySearchSim } from '@/components/simulations/binary-search/BinarySearchSim';
import { PredictPrompt } from '@/components/quiz/PredictPrompt';
import { CheckpointQuiz, QuizQuestion } from '@/components/quiz/CheckpointQuiz';
import { MathFormula } from '@/components/common/MathFormula';
import { saveLessonProgress } from '@/lib/storage/progress';

const PREDICT_OPTIONS = [
  {
    text: 'Cần tối đa 15 lần so sánh (bằng kích thước mảng).',
    explanation: 'Sai! 15 lần so sánh là trường hợp xấu nhất của tìm kiếm tuần tự (Linear Search), không phải Binary Search.',
  },
  {
    text: 'Cần tối đa 4 lần so sánh vì 2^4 = 16 > 15.',
    explanation: 'Chính xác! Mỗi bước loại bỏ 1/2 số phần tử còn lại, nên số bước tối đa là ceil(log2(N+1)) = 4 bước.',
  },
  {
    text: 'Cần đúng 2 lần so sánh vì chỉ cần chia đôi 2 lần.',
    explanation: 'Sai! Sau 2 lần chia đôi, mảng 15 phần tử vẫn còn khoảng 3-4 phần tử cần tiếp tục tìm kiếm.',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'bs-q1',
    question: 'Tại sao thuật toán Binary Search yêu cầu mảng phải được sắp xếp trước?',
    options: [
      'Để mảng lưu trữ ít bộ nhớ hơn trong RAM',
      'Để việc so sánh với phần tử ở giữa (mid) cho phép loại bỏ chắc chắn 50% các phần tử còn lại',
      'Để tránh lỗi tràn số khi tính trung vị mid = (low + high) / 2',
      'Chỉ để code ngắn hơn, không bắt buộc về mặt toán học',
    ],
    correctIndex: 1,
    explanation:
      'Chỉ khi mảng đã sắp xếp, nếu target > arr[mid], ta mới dám khẳng định 100% target không thể nằm ở nửa bên trái arr[0..mid].',
  },
  {
    id: 'bs-q2',
    question: 'Khi phần tử target KHÔNG có trong mảng, vòng lặp dừng lại ở trạng thái nào?',
    options: [
      'Khi mid = 0',
      'Khi low > high (hai con trỏ đảo chéo qua nhau)',
      'Khi arr[mid] trả về giá trị null hoặc undefined',
      'Vòng lặp sẽ chạy vô tận nếu không có lệnh break',
    ],
    correctIndex: 1,
    explanation:
      'Vòng lặp có điều kiện `while (low <= high)`. Khi khoảng tìm kiếm thu hẹp về 0 mà vẫn không thấy, con trỏ low sẽ vượt qua high (low > high).',
  },
  {
    id: 'bs-q3',
    question: 'Với mảng có 1 triệu phần tử (khoảng 1,000,000), Binary Search cần tối đa bao nhiêu lần so sánh?',
    options: [
      'Khoảng 20 lần so sánh (vì 2^20 ≈ 1,048,576)',
      'Khoảng 500,000 lần so sánh (chia đôi 1 triệu)',
      'Khoảng 10,000 lần so sánh',
      '1,000,000 lần so sánh',
    ],
    correctIndex: 0,
    explanation:
      'Độ phức tạp O(log2(N)). log2(1,000,000) ≈ 19.93, nghĩa là tối đa chỉ mất 20 lần so sánh để tìm trong 1 triệu phần tử!',
  },
];

export default function BinarySearchPage() {
  const handleCompleteLesson = () => {
    saveLessonProgress({ lessonId: 'binary-search', completed: true });
  };

  const sections: LessonSection[] = [
    {
      id: 'ban-chat', label: 'Bản chất', title: 'Nguyên lý chia đôi không gian tìm kiếm',
      content: <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Hãy tưởng tượng bạn đang tìm một từ trong cuốn từ điển 1,000 trang. Bạn sẽ không lật từng trang từ trang 1 đến trang 1,000 (đó là tìm kiếm tuyến tính <MathFormula math="O(n)" />). Thay vào đó, bạn mở ngay ở <strong>chính giữa cuốn sách</strong>.
          </p>

          <p>
            Nếu từ bạn cần tìm đứng sau từ ở trang giữa theo thứ tự chữ cái, bạn lập tức <strong>vứt bỏ toàn bộ nửa trước</strong> và chỉ tìm trong nửa sau.
          </p>

          <div className="border-l-2 border-accent bg-accent-soft/50 p-4">
            <p className="text-xs font-medium text-accent-ink">
              Công thức vị trí trung vị:
            </p>
            <MathFormula math="\text{mid} = \left\lfloor \frac{\text{low} + \text{high}}{2} \right\rfloor" block />
            <p className="text-[11px] text-muted">
              Độ phức tạp thời gian: <MathFormula math="O(\log_2 n)" /> — cực kỳ nhanh ngay cả với hàng triệu phần tử.
            </p>
          </div>
      </div>,
    },
    {
      id: 'du-doan', label: 'Dự đoán', title: 'Dự đoán kết quả',
      content: (
      <PredictPrompt
        question="Mảng mẫu trong phần thực hành bên dưới có 15 phần tử [index 0 đến 14]. Theo bạn, số lần so sánh tối đa ở trường hợp xấu nhất là bao nhiêu?"
        options={PREDICT_OPTIONS}
        onAnswered={() => {
          saveLessonProgress({ lessonId: 'binary-search', predictionAnswered: true });
        }}
      />
      ),
    },
    {
      id: 'thuc-hanh', label: 'Thực hành', title: 'Mô phỏng thuật toán tìm kiếm nhị phân',
      content: (
        <div className="space-y-5">
          <div className="border-l-2 border-accent bg-accent-soft/40 p-4 sm:p-5">
            <p className="kicker">Bạn hãy thử</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                  <li>Giữ mục tiêu 55. Bấm tiến từng bước và theo dõi low, mid, high thay đổi.</li>
                  <li>Đổi mục tiêu sang 7 hoặc 130. So sánh số bước ở hai đầu mảng.</li>
                  <li>Chọn 50 (không có). Chạy đến cuối và quan sát lúc low vượt high.</li>
            </ol>
          </div>
          <BinarySearchSim />
        </div>
      ),
    },
    {
      id: 'nhan-xet', label: 'Nhận xét', title: 'Độ phức tạp và điều kiện dừng',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
              <p>Mỗi lần so sánh ở vị trí giữa, ta giữ lại nhiều nhất một nửa khoảng tìm kiếm. Với 15 phần tử, khoảng tìm kiếm có thể thu hẹp từ 15 xuống 7, rồi 3, rồi 1.</p>
              <MathFormula math="T(n) = O(\log_2 n)" block />
              <p>Hãy đối chiếu với dự đoán ban đầu: số bước tăng rất chậm khi kích thước mảng tăng. Điều kiện làm được điều đó là <strong>mảng phải có thứ tự</strong>.</p>
              <p className="text-muted">Mô phỏng tách riêng thao tác so sánh và cập nhật con trỏ thành từng bước. Số lần so sánh chỉ tính những lần xét arr[mid], nên có thể ít hơn số bước hiển thị.</p>
              <p>Khi không tìm thấy, khoảng tìm kiếm rỗng: <code>low &gt; high</code>. Đây là điều kiện dừng, không phải lỗi của thuật toán.</p>
        </div>
      ),
    },
    {
      id: 'kiem-tra', label: 'Kiểm tra', title: 'Bài tập củng cố',
      content: (
        <>
          <p className="mb-5 text-sm leading-relaxed text-muted">Trả lời ba câu hỏi để đối chiếu với những gì bạn vừa quan sát. Sau khi nộp, mỗi câu đều có lời giải thích.</p>
      <CheckpointQuiz
        lessonId="binary-search"
        questions={QUIZ_QUESTIONS}
        onCompleteLesson={handleCompleteLesson}
      />
        </>
      ),
    },
  ];

  return (
    <LessonLayout
      lessonId="binary-search"
      category="Thuật toán & Cấu trúc dữ liệu"
      title="Tìm kiếm nhị phân"
      duration="15–20"
      sections={sections}
      summary={<p>So sánh với phần tử ở giữa → giữ lại nửa có thể chứa mục tiêu → lặp lại. Mảng phải được sắp xếp. Tìm thấy khi arr[mid] bằng mục tiêu; không tìm thấy khi low vượt high.</p>}
    />
  );
}
