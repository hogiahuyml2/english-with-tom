# English With Tom — Bản demo giao diện (localhost)

Website tĩnh luyện thi chứng chỉ quốc tế: KET, PET, FCE, APTIS, IELTS.
Tone màu pastel xanh–tím, giao diện tiếng Việt.

## Cách chạy trên máy của bạn

Mở **Terminal**, dán lần lượt 2 dòng sau:

```bash
cd "/Users/ghuyho/Claude GH/english-with-tom"
python3 -m http.server 8000
```

Sau đó mở trình duyệt và vào địa chỉ: **http://localhost:8000**

Để dừng máy chủ: bấm `Ctrl + C` trong Terminal.

## Các trang đã có

| Trang | File | Nội dung |
|-------|------|----------|
| Trang chủ | `index.html` | Giới thiệu + 6 chương trình |
| Tiến trình học | `dashboard.html` | Số bài làm, bài đã chấm, điểm TB |
| Bài tập được giao | `assigned.html` | Bài thầy Tom giao cho lớp riêng |
| KET / PET / FCE / APTIS / IELTS | `ket.html` … `ielts.html` | 4 kỹ năng mỗi chương trình |
| Làm bài mẫu | `practice-reading.html` | Giao diện làm + nộp bài |
| Đăng nhập / Đăng ký | `login.html` | Email + Google, vai trò HS/GV |
| Khu vực giáo viên | `teacher.html` | Nhập đề, giao bài, chấm bài |

## Lưu ý

Đây là **giai đoạn 1 — giao diện tĩnh** (chưa có database thật, chưa đăng nhập thật,
chưa nối Claude API). Các nút bấm là minh hoạ. Giai đoạn sau sẽ thêm:
tài khoản thật, lưu bài vào database, và chấm bài bằng AI.

## Cấu trúc thư mục

```
english-with-tom/
├── index.html            Trang chủ
├── dashboard.html        Tiến trình học
├── assigned.html         Bài tập được giao
├── ket/pet/fce/aptis/ielts.html
├── practice-reading.html Làm bài mẫu
├── login.html            Đăng nhập / đăng ký
├── teacher.html          Khu vực giáo viên
├── css/style.css         Toàn bộ giao diện
├── js/main.js            Menu + tương tác
└── gen_pages.py          Script sinh trang (không cần chạy lại)
```
