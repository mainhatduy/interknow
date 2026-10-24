# Tiêu chuẩn thiết kế bài học

Mỗi bài là một trang đọc liên tục từ trên xuống. Dùng `LessonLayout` và khai báo các phần bằng `LessonSection[]`; không đặt mô phỏng trong cột bên phải hay ẩn nội dung sau tab trên điện thoại.

## Quy tắc đặt tên

Tên bài dùng thuật ngữ học thuật mô tả trực tiếp chủ đề và phạm vi, ví dụ “Hồi quy tuyến tính đơn”, “Đạo hàm và tiếp tuyến”. Không dùng lời dẫn quảng bá như “Hiểu”, “Từ con số 0”, “Bí quyết” hoặc “Dễ dàng”. Tên bài phải nhất quán giữa trang chủ, thanh điều hướng và tiêu đề bài học. Tiêu đề các phần nêu rõ khái niệm, phương pháp hoặc nhiệm vụ học tập.

Văn phong ngắn gọn, trực tiếp; bỏ lời dẫn và nhãn lặp không bổ sung kiến thức. Khối mã chỉ ghi tên ngôn ngữ, ví dụ “Python”; đầu ra ghi “Kết quả” một lần. Mã có tô màu cú pháp theo ngôn ngữ, giữ nguyên thụt lề và cho phép cuộn ngang trên màn hình nhỏ.

Dùng thuật ngữ tiếng Anh phổ biến như Linear Regression, loss function, objective function, residual, squared error, least squares, training data, test data và fit. Giải thích ngắn bằng tiếng Việt ở lần đầu thuật ngữ xuất hiện trong nội dung, sau đó dùng nhất quán trong tiêu đề, mô phỏng, mã và bài tập. Phần diễn giải giữ tiếng Việt; không cần dịch mọi thuật ngữ sang tiếng Việt.

## Khung chung

- Đầu bài: chủ đề, thời lượng ước tính và tiêu đề; đi thẳng vào mục lục, không thêm mô tả phụ, khung mục tiêu hay điều kiện tiên quyết.
- Thanh điều hướng: logo và liên kết cần thiết; không kèm khẩu hiệu hoặc bộ đếm bài hoàn thành.
- Mục lục: danh sách dọc như mục lục sách, có số thứ tự và tên đầy đủ của từng phần. Dùng liên kết đến ID ổn định; không trình bày dưới dạng thẻ, nút hay các block nằm ngang.
- Nội dung: một cột rộng tối đa `max-w-3xl`, tiêu đề phần có số thứ tự, khoảng cách và đường phân cách nhất quán.
- Hoạt động: đặt ngay sau phần giải thích liên quan, ghi rõ thao tác cần thử và điều cần quan sát. Phản hồi và kết quả xuất hiện ngay tại hoạt động đó.
- Cuối bài: câu hỏi kiểm tra có giải thích và phần điểm cần nhớ. Tiến độ hoàn thành chỉ ghi nhận qua bài kiểm tra.
- Điện thoại: giữ nguyên thứ tự và toàn bộ nội dung; cho công thức hoặc bảng rộng cuộn bên trong, tránh tràn ngang trang.
- Điều khiển: có tên truy cập được, dùng được bằng bàn phím; biểu đồ có mô tả và không che nhãn bằng chú giải.

## Thiết kế theo từng bài

| Bài | Luồng nội dung | Tương tác cần có | Kết quả cần nhận ra |
| --- | --- | --- | --- |
| Hồi quy tuyến tính đơn | Giá nhà → mô hình → hàm mất mát → thực hành → Python → đánh giá → kiểm tra | Đổi diện tích; so sánh phần dư và MSE của hai mô hình; chỉnh w, b rồi đối chiếu với khớp bình phương tối thiểu | Phân biệt dự đoán với hàm mất mát; học tham số là tối thiểu hóa MSE; đánh giá bằng dữ liệu chưa dùng để học |
| Tìm kiếm nhị phân | Bản chất → dự đoán → thực hành → nhận xét → kiểm tra | Chọn số có/không có, tiến từng bước, chạy/dừng; điều khiển đặt ngay sau hình mảng và trước mã nguồn | Khoảng tìm kiếm giảm một nửa; low > high khi không tìm thấy |
| Đạo hàm | Bản chất → dự đoán → thực hành → nhận xét → kiểm tra | Chọn hàm, đổi x₀ và Δx, chạy Δx → 0 | Độ dốc cát tuyến tiến đến tiếp tuyến; dấu đạo hàm đổi qua đỉnh parabol x₀ = 1 |
| Biến đổi tuyến tính | Bản chất → dự đoán → thực hành → nhận xét → kiểm tra | Chọn phép biến đổi, chạy/kéo tiến trình, sửa bốn phần tử ma trận | Hai cột xác định hai vector cơ sở; định thức đo thay đổi diện tích và dấu chỉ hướng |

Số phần có thể thay đổi theo nội dung. Không ép mọi bài dùng cùng một mô phỏng: thống nhất cách đọc, còn nhiệm vụ thực hành phải phục vụ khái niệm của bài. Hướng dẫn, công thức và kết luận phải dùng đúng dữ liệu đang hiển thị trong mô phỏng. Mẫu Python ở bài Regression là ví dụ mã và đầu ra, không phải trình chạy Python.

Dữ liệu hồi quy có độ phân tán nhẹ quanh xu hướng tuyến tính và được ghi rõ là dữ liệu mẫu. Bảng số liệu, biểu đồ và mã Python dùng chung `REGRESSION_DATA`; không yêu cầu người học tìm đường thẳng đi qua mọi điểm hay đưa MSE về 0.

Bài hồi quy giải thích phần dư → bình phương sai số → MSE → mục tiêu tối thiểu hóa bằng số cụ thể và thao tác trực tiếp. Dùng MSE nhất quán trong công thức, mô phỏng và Python; khi đối chiếu tài liệu dùng nửa tổng bình phương sai số, nêu ngắn gọn rằng hai cách cho cùng tham số tối ưu trên cùng bộ dữ liệu. Giải thích dữ liệu học/kiểm tra, ngoại suy và ảnh hưởng của điểm khác biệt; không yêu cầu đạo hàm, ma trận hay chứng minh nghiệm tối ưu.
