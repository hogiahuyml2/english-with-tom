# Hướng dẫn vận hành — English With Tom

> Tài liệu này giúp bạn tự quản lý và phát triển website **mà không cần Claude hoặc lập trình viên**.  
> Viết cho người không có nền tảng kỹ thuật — đọc từng bước, làm theo là được.

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Thêm đề bài trực tiếp trên web](#2-thêm-đề-bài-trực-tiếp-trên-web) ⭐ Quan trọng nhất
3. [Quản lý học sinh và giáo viên](#3-quản-lý-học-sinh-và-giáo-viên)
4. [Sửa code nhỏ trên GitHub (không cần cài đặt gì)](#4-sửa-code-nhỏ-trên-github)
5. [Thêm đề hàng loạt bằng cách sửa code](#5-thêm-đề-hàng-loạt-bằng-cách-sửa-code)
6. [Biến môi trường trên Railway](#6-biến-môi-trường-trên-railway)
7. [Backup và khôi phục dữ liệu](#7-backup-và-khôi-phục-dữ-liệu)
8. [Xử lý sự cố thường gặp](#8-xử-lý-sự-cố-thường-gặp)
9. [Tài khoản và mật khẩu quan trọng](#9-tài-khoản-và-mật-khẩu-quan-trọng)

---

## 1. Tổng quan hệ thống

```
Bạn sửa code  →  Push lên GitHub  →  Railway tự deploy  →  Website cập nhật
(hoặc dùng web)         (tự động)          (1–2 phút)
```

| Thành phần | Là gì | Link quản lý |
|---|---|---|
| **Railway** | Nơi chạy website (hosting) | https://railway.app |
| **GitHub** | Nơi lưu mã nguồn | https://github.com/hogiahuyml2/english-with-tom |
| **Brevo** | Dịch vụ gửi email | https://app.brevo.com |
| **Google Cloud** | Đăng nhập bằng Google | https://console.cloud.google.com |
| **Gemini API** | AI chấm bài Writing | https://aistudio.google.com |

**Website chạy hoàn toàn độc lập** — không phụ thuộc Claude, không phụ thuộc máy tính của bạn. Chỉ cần Railway và GitHub đang hoạt động.

---

## 2. Thêm đề bài trực tiếp trên web

Đây là cách **dễ nhất** — không cần code, không cần GitHub, làm ngay trên web.

### Bước 1: Đăng nhập tài khoản giáo viên

1. Mở https://english-with-tom-production.up.railway.app/login.html
2. Đăng nhập bằng **tom@ewt.vn** (hoặc tài khoản giáo viên bạn tự tạo)
3. Bấm **"Khu vực giáo viên"** trên thanh menu

---

### 2A. Thêm đề Writing (AI chấm tự động)

Dùng cho: KET Writing, PET Writing, FCE Writing, IELTS Writing Task 1 & 2, APTIS Writing

**Trong trang Khu vực giáo viên → mục "Tạo đề mới":**

| Trường | Điền gì |
|---|---|
| **Chương trình** | KET / PET / FCE / IELTS / APTIS |
| **Kỹ năng** | Writing |
| **Tiêu đề đề** | Ví dụ: `KET Writing Part 1 — Email thông báo nghỉ học` |
| **Nội dung đề** | Copy-paste đề bài thật từ sách Cambridge hoặc tự soạn |
| **Loại đề** | Chọn **"Writing (AI chấm)"** |
| **Hình ảnh** | Upload ảnh minh hoạ nếu cần (JPG/PNG, tối đa 20MB) |

**Ví dụ nội dung đề KET Writing Part 1:**
```
You are going to visit your English friend next week.
Write an email to your friend Kim.
Say:
- when you are arriving
- where you would like to go
- what you want to eat

Write 25 words or more.
```

**Ví dụ nội dung đề IELTS Writing Task 2:**
```
Write about the following topic:

Some people think that governments should spend money on
measures to save endangered animal species. Others believe
that the money should be spent on human problems instead.

Discuss both views and give your own opinion.

Write at least 250 words.
```

---

### 2B. Thêm đề Trắc nghiệm (Reading hoặc Listening)

Dùng cho: tất cả đề Reading, đề Listening có file audio

**Trong trang Khu vực giáo viên → "Tạo đề mới":**

| Trường | Điền gì |
|---|---|
| **Chương trình** | KET / PET / FCE / IELTS / APTIS |
| **Kỹ năng** | Reading hoặc Listening |
| **Loại đề** | Chọn **"Trắc nghiệm (tự chấm)"** |
| **Nội dung đề** | Đoạn văn / hướng dẫn nghe |
| **Hình ảnh** | Upload ảnh biểu đồ, bản đồ (nếu có) |
| **File âm thanh** | Upload file MP3/WAV cho đề Listening |

**Thêm câu hỏi:** Bấm **"+ Thêm câu hỏi"** cho mỗi câu:
- Nhập câu hỏi (tiếng Việt hoặc tiếng Anh đều được)
- Nhập các lựa chọn A, B, C (hoặc thêm D)
- Chọn đáp án đúng

> 💡 **Mẹo:** Đề Reading thường có đoạn văn dài ở "Nội dung đề", câu hỏi phía dưới.  
> Đề Listening thường để "Nội dung đề" là hướng dẫn ngắn + upload file MP3.

---

### 2C. Giao bài cho học sinh

Sau khi tạo đề xong:
1. Vào **Khu vực giáo viên** → tab **"Giao bài"**
2. Chọn đề muốn giao
3. Chọn học sinh (hoặc giao cho tất cả)
4. Học sinh sẽ thấy bài trong mục **"Bài tập được giao"**

---

### 2D. Xem bài làm của học sinh

1. Vào **Khu vực giáo viên** → tab **"Bài nộp"**
2. Lọc theo học sinh hoặc đề bài
3. Bài Writing: xem điểm AI + nhận xét chi tiết + bài viết gợi ý
4. Bài Trắc nghiệm: xem điểm + số câu đúng/sai

---

## 3. Quản lý học sinh và giáo viên

Dùng tài khoản **admin@ewt.vn** để quản lý.

### Tạo tài khoản giáo viên mới

1. Vào **trang Quản trị** (nút "Quản trị" trên menu, chỉ admin thấy)
2. Mục **"Tạo tài khoản giáo viên"**
3. Điền tên, email, mật khẩu
4. Giáo viên đăng nhập bằng email/mật khẩu vừa tạo

### Nâng học sinh lên giáo viên

1. Trang Quản trị → tab **"Người dùng"**
2. Tìm học sinh → bấm **"Đổi vai trò"** → chọn **"Giáo viên"**

### Xoá tài khoản

Trang Quản trị → tìm tài khoản → nút **"Xoá"** (sẽ xoá cả bài làm của người đó)

---

## 4. Sửa code nhỏ trên GitHub

Khi cần thay đổi nhỏ (sửa chữ, màu sắc, thêm link...) mà **không có Claude**:

### Bước 1: Mở GitHub

1. Mở https://github.com/hogiahuyml2/english-with-tom
2. Đăng nhập bằng tài khoản **hogiahuyml2**

### Bước 2: Tìm file cần sửa

Các file quan trọng:
| File | Dùng để |
|---|---|
| `index.html` | Trang chủ |
| `ket.html`, `pet.html`, `fce.html`, `ielts.html`, `aptis.html` | Trang từng kỳ thi |
| `server.js` | Logic backend (cẩn thận khi sửa) |
| `db.js` | Dữ liệu đề mẫu (xem mục 5) |
| `js/main.js` | Menu, header, footer chung |
| `css/style.css` | Giao diện màu sắc, font chữ |

### Bước 3: Sửa file

1. Bấm vào file muốn sửa
2. Bấm nút ✏️ **Edit** (bút chì, góc phải)
3. Sửa nội dung
4. Kéo xuống → **"Commit changes"** → nhập mô tả → bấm **"Commit changes"**

### Bước 4: Đợi Railway deploy

- Sau khi commit, Railway tự nhận và deploy lại trong **1–2 phút**
- Mở web kiểm tra kết quả

---

## 5. Thêm đề hàng loạt bằng cách sửa code

Nếu muốn thêm nhiều đề cùng lúc (ví dụ: 20 đề KET Reading mới), cách nhanh nhất là **sửa file `db.js` trên GitHub**.

### Cấu trúc đề Writing (không có câu hỏi)

```javascript
{ 
  program: 'KET',        // KET / PET / FCE / IELTS / APTIS
  skill: 'Writing',      // Writing / Reading / Listening
  title: 'KET Writing Part 1 — Email thông báo nghỉ học',
  content: `You cannot go to your English class next week.
Write a note to your teacher.
Say:
- why you cannot come
- when you will come back
- what you will do to catch up

Write 25 words or more.`
}
```

### Cấu trúc đề Trắc nghiệm (có câu hỏi + đáp án)

```javascript
{
  program: 'KET',
  skill: 'Reading',
  title: 'KET Reading Part 4 — School Rules',
  content: `Read the notice about school rules. Choose the correct answer.

SCHOOL RULES

Students must arrive by 8:00 a.m. every day.
Mobile phones must be turned off in class.
Students cannot eat or drink in classrooms.
The library is open Monday to Friday from 7:30 a.m. to 5:30 p.m.
PE kit must be brought on Tuesdays and Thursdays.`,

  questions: [
    { q: 'What time must students arrive?',
      options: ['7:30 a.m.', '8:00 a.m.', '8:30 a.m.'] },
    { q: 'When is the library open?',
      options: ['Every day including weekends', 'Monday to Friday only', 'Tuesdays and Thursdays only'] },
    { q: 'What must students bring on Thursdays?',
      options: ['Their mobile phones', 'Their PE kit', 'Their lunch'] },
  ],
  answer_key: ['B', 'B', 'B']  // B = đáp án thứ 2 (đếm từ A)
}
```

> ⚠️ **Lưu ý `answer_key`:** A = lựa chọn đầu tiên, B = thứ hai, C = thứ ba, D = thứ tư.  
> Ví dụ: nếu đáp án đúng là lựa chọn thứ 2, ghi `'B'`.

### Cách thêm vào `db.js`

1. Mở file `db.js` trên GitHub
2. Bấm ✏️ Edit
3. Tìm dòng: `// ---------- KET WRITING ----------`
4. Copy một khối đề mẫu đã có, dán thêm vào cuối mảng tương ứng
5. Đổi nội dung theo đề mới của bạn
6. Ở cuối mảng `ALL_PRESET_EXERCISES`, đảm bảo đề mới của bạn đã được gộp vào
7. **Commit** → Railway deploy → đề tự xuất hiện trong ngân hàng đề

> ✅ Hệ thống **không bao giờ thêm đề trùng** — nếu đề có cùng tiêu đề đã tồn tại thì bỏ qua. Yên tâm chạy lại nhiều lần.

---

## 6. Biến môi trường trên Railway

**Không bao giờ để lộ các giá trị này ra ngoài.**

### Cách xem/sửa

1. Mở https://railway.app → Đăng nhập
2. Chọn project **"resilient-perfection"**
3. Chọn service **english-with-tom**
4. Tab **"Variables"**

### Danh sách biến quan trọng

| Biến | Giá trị | Dùng để |
|---|---|---|
| `DATA_DIR` | `/data` | Lưu database bền vững (KHÔNG xoá) |
| `PORT` | `8080` | Cổng Railway (KHÔNG thay đổi) |
| `GEMINI_API_KEY` | `AIza...` | AI chấm bài (Gemini 2.5 Flash — miễn phí) |
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | Đăng nhập Google |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Đăng nhập Google |
| `BREVO_API_KEY` | `xkeysib-...` | Gửi email xác thực + quên mật khẩu |
| `FROM_EMAIL` | `hogiahuyml2@gmail.com` | Email người gửi (đã verify trong Brevo) |

### Khi nào cần sửa biến

| Tình huống | Làm gì |
|---|---|
| Gemini API hết quota | Vào https://aistudio.google.com → tạo API key mới → cập nhật `GEMINI_API_KEY` |
| Brevo API key hết hạn | Vào https://app.brevo.com → tạo API key mới → cập nhật `BREVO_API_KEY` |
| Muốn đổi tên người gửi email | Thêm biến `SENDER_NAME=English With Tom` |

---

## 7. Backup và khôi phục dữ liệu

Database (danh sách học sinh, bài làm, đề bài) được lưu trong **Railway Volume** tại đường dẫn `/data/data.db`.

### Backup thủ công (làm mỗi tháng)

1. Mở Railway → project → service → tab **"Deployments"**
2. Hoặc dùng Railway CLI (nâng cao — liên hệ kỹ thuật nếu cần)

> 💡 **Lưu ý quan trọng:** Đừng bao giờ xoá Railway Volume `/data`. Nếu xoá, toàn bộ dữ liệu học sinh và bài làm sẽ mất. Các đề mẫu trong `db.js` sẽ được tạo lại tự động, nhưng bài làm của học sinh thì không.

### Dữ liệu nào an toàn khi redeploy

| Dữ liệu | Có mất khi redeploy không? |
|---|---|
| Đề mẫu trong `db.js` | ❌ Không mất — tự tạo lại |
| Tài khoản admin/teacher mặc định | ❌ Không mất — tự tạo lại (nếu chưa có) |
| Bài làm của học sinh | ✅ **An toàn** — lưu trong Volume `/data` |
| Tài khoản học sinh | ✅ **An toàn** — lưu trong Volume `/data` |
| Đề giáo viên tạo trên web | ✅ **An toàn** — lưu trong Volume `/data` |
| File ảnh/audio giáo viên upload | ✅ **An toàn** — lưu trong `/data/uploads` |

---

## 8. Xử lý sự cố thường gặp

### Web không load / lỗi 502

1. Mở https://railway.app → project → xem tab **"Deployments"**
2. Nếu có lỗi đỏ → bấm vào deployment → xem **"Build Logs"** / **"Deploy Logs"**
3. Lỗi thường gặp:
   - `Cannot find module` → thiếu thư viện (chạy `npm install` — liên hệ kỹ thuật)
   - `SyntaxError` → sửa code bị lỗi cú pháp → kiểm tra file vừa sửa trên GitHub
   - `ENOENT: data.db` → Volume chưa gắn (kiểm tra biến `DATA_DIR=/data`)

### AI chấm bài không hoạt động

1. Vào Railway → Variables → kiểm tra `GEMINI_API_KEY` còn đúng không
2. Vào https://aistudio.google.com → kiểm tra quota còn không (Gemini 2.5 Flash miễn phí có giới hạn/ngày)
3. Nếu hết quota: tạo API key mới → cập nhật biến

### Email xác thực / quên mật khẩu không gửi được

1. Vào https://app.brevo.com → kiểm tra còn quota email không (miễn phí 300 email/ngày)
2. Kiểm tra biến `BREVO_API_KEY` và `FROM_EMAIL` trong Railway
3. Kiểm tra email `hogiahuyml2@gmail.com` đã được verify trong Brevo chưa

### Học sinh không đăng nhập được bằng Google

1. Vào https://console.cloud.google.com → project **"english-with-tom"**
2. **APIs & Services** → **Credentials** → kiểm tra OAuth 2.0 Client còn hoạt động
3. Đảm bảo **Authorized redirect URIs** có: `https://english-with-tom-production.up.railway.app/api/auth/google/callback`

### Web bị chậm bất thường

Railway free tier có thể ngủ sau 30 phút không có request. Bạn có thể:
- Nâng gói Railway (Hobby plan ~$5/tháng) để không bị sleep
- Hoặc dùng service như UptimeRobot để ping web mỗi 5 phút (miễn phí)

---

## 9. Tài khoản và mật khẩu quan trọng

> ⚠️ Lưu thông tin này ở nơi an toàn. Không chia sẻ với người lạ.

### Tài khoản web English With Tom

| Tài khoản | Email | Vai trò |
|---|---|---|
| Quản trị viên | `admin@ewt.vn` | Toàn quyền — quản lý người dùng, xoá đề |
| Giáo viên Tom | `tom@ewt.vn` | Tạo đề, giao bài, xem bài nộp |

> Mật khẩu ban đầu: `Admin@123` / `Tom@1234`  
> Nếu đã đổi: bạn nhớ mật khẩu mới hoặc dùng tính năng **Quên mật khẩu** để reset.

### Tài khoản dịch vụ

| Dịch vụ | Tài khoản | Link |
|---|---|---|
| GitHub | hogiahuyml2 | https://github.com |
| Railway | (email bạn đăng ký) | https://railway.app |
| Brevo | hogiahuyml2@gmail.com | https://app.brevo.com |
| Google Cloud | hogiahuyml2@gmail.com | https://console.cloud.google.com |
| Google AI Studio (Gemini) | hogiahuyml2@gmail.com | https://aistudio.google.com |

---

## Tóm tắt nhanh: Làm gì khi muốn thêm đề?

```
Đề Writing   →  Đăng nhập web → Khu vực giáo viên → Tạo đề → Chọn "Writing (AI chấm)"
Đề Reading   →  Đăng nhập web → Khu vực giáo viên → Tạo đề → Chọn "Trắc nghiệm" → Thêm câu hỏi
Đề Listening →  Như trên + Upload file MP3/WAV
Nhiều đề cùng lúc → Sửa file db.js trên GitHub (xem mục 5)
```

---

*Cập nhật lần cuối: tháng 6/2026 — English With Tom v3*
