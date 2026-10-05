# Đọc hiểu theo cấp độ (A1–C1)

- `src/*.json` — mỗi bài: văn bản, câu hỏi + đáp án + giải thích, ghi chú từ vựng/collocation/cấu trúc, nguồn + giấy phép.
- `bank.json` — file dựng sẵn (tách từ, gắn từ loại theo ngữ cảnh, nghĩa từng từ). **Không sửa tay**; chạy lại `python3 reading/tools/build.py` sau khi sửa `src/`.
- `tools/harvest_*.py` — script lấy bài ứng viên từ nguồn công khai (VOA Learning English, Wikipedia) để chọn bài; `tools/build.py` dựng `bank.json`.

## Nguồn & giấy phép
- **VOA Learning English** (chỉ chọn bài do biên tập viên VOA tự viết; loại bỏ các bài lại từ AP/AFP/Reuters…): nội dung VOA thuộc phạm vi công cộng.
- **Wikipedia / Simple English Wikipedia**: CC BY-SA 4.0 — luôn ghi tên bài + liên kết nguồn; bài A1 là *bản chuyển thể* (câu ngắn, từ đơn giản) nên ghi rõ "bản chuyển thể".
- Không dùng nguyên văn từ sách giáo trình có bản quyền (Cambridge, Oxford…) dù có trong máy giáo viên. Bài `b1-city-ratings` được **diễn đạt lại hoàn toàn bằng lời khác** từ ý tưởng của một đoạn trong sách Complete IELTS Bands 4–5, câu hỏi và ghi chú soạn riêng. Các sách còn lại trong máy (Cambridge KET/FCE/…) chủ yếu là bài tập thi hoặc bản quét ảnh, không có bài đọc dài phù hợp để diễn đạt lại.
- Câu hỏi, đáp án, giải thích, ghi chú: do web soạn riêng cho từng bài.
- Nghĩa tra từ tự động lấy từ Wiktionary (CC BY-SA) và WordNet; luôn gắn nhãn "gợi ý tự động" cho học sinh kiểm tra thêm.

## Thêm / thay bài
1. Tạo `src/<id>.json` theo mẫu các bài có sẵn (id dạng `b1-xxx`; level A1|A2|B1|B2|C1).
2. `python3 reading/tools/build.py` → sinh lại `bank.json`.
3. Commit cả `src/` và `bank.json`.
