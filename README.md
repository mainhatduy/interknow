# InterKnow

Tạp chí tri thức tương tác về thuật toán, giải tích, đại số tuyến tính và machine learning.

Website: https://mainhatduy.github.io/interknow/

## Chạy local

Sử dụng Node.js 22.12 trở lên.

```bash
npm ci
npm run dev
```

Mở http://localhost:3000.

## Kiểm tra và build

```bash
npm test
npm run build
```

Next.js xuất website tĩnh vào thư mục `out/`. Để build với đường dẫn của GitHub Pages:

```bash
NEXT_PUBLIC_BASE_PATH=/interknow npm run build
```

## Deploy lên GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` tự chạy kiểm thử, build và deploy mỗi khi push lên `main`. Có thể chạy lại từ tab **Actions → Deploy to GitHub Pages → Run workflow**.

Trong **Settings → Pages**, chọn nguồn **GitHub Actions**. Workflow lấy đường dẫn gốc từ cấu hình Pages để các link, JavaScript và CSS hoạt động dưới `/interknow/`.

Tiến độ học được lưu trong trình duyệt bằng localStorage.
