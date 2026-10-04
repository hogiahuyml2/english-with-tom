# Công cụ dựng bài nghe (chạy trên máy dev, không chạy trên server)

Nguồn: englishpracticetest.net (đề nghe KET/PET/FCE + A1) — âm thanh gốc kèm đáp án và lời thoại.
`build.py` tải trang đề + mp3, cắt từng câu theo khoảng lặng (kiểm tra số đoạn = số câu), nén AAC 32 kbps, tải/thu nhỏ hình.
Cần: Python 3, ffmpeg (pip `imageio-ffmpeg`, ghi đường dẫn vào `../ff.env` dạng `export FF='...'`), macOS `sips`.
Sau khi dựng: duyệt từng câu (đối chiếu đáp án với lời thoại và hình) rồi chép vào `placement/audio`, `placement/img`, `placement/bank/listen.json`.
Đề nào cắt không khớp số câu thì bị bỏ qua (in "cannot split"). Câu bị loại do mơ hồ: l-pet12p2-6.
