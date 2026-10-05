# Công cụ dựng ngân hàng Chép chính tả (chạy trên máy dev, KHÔNG chạy trên server)

Nguồn: bản ghi gốc của Cambridge trong đề nghe A1 / KET / PET / FCE (đã cắt sẵn ở `placement/audio`) và đề CAE (C1) từ englishpracticetest.net — chỉ dùng cho mục đích học tập phi lợi nhuận.
Mỗi câu chép chính tả = một câu cắt từ đoạn nghe, kèm văn bản gốc để chấm.

Cần: Python 3, `pip install --user imageio-ffmpeg faster-whisper` (mô hình `small.en` tự tải lần đầu, ~460 MB).

```
python3 units.py            # (A1/KET/PET/FCE)  hoặc: python3 units.py cae 1-6  (thêm CAE C1: tải trang + mp3 vào /tmp/ewt-dict/cae, không đưa vào mã nguồn)
python3 asr.py small.en     # nhận dạng giọng nói + mốc thời gian từng từ → /tmp/ewt-dict/asr
python3 build.py small.en   # cắt câu + KIỂM TRA LẠI + ghi dictation/bank.json, dictation/audio/*.m4a
python3 build.py small.en --lv C1 --append   # chỉ thêm câu của cấp C1 vào ngân hàng có sẵn
node test-check.js          # kiểm thử bộ chấm (dictation-check.js)
```

**Đảm bảo chính xác:** câu chỉ được giữ khi nhận dạng giọng nói trên chính đoạn đã cắt cho ra ĐÚNG câu gốc (không thiếu từ, không dính từ của câu bên cạnh ở hai đầu). Câu không đạt bị loại, không "đoán". Loại thêm: câu quá ngắn/dài, đánh vần chữ cái, chuỗi số, trùng lặp.
Mỗi câu có `lv` (A1/A2/B1/B2/C1) và `kind` (`single` = câu đơn, `compound` = câu ghép/phức, phân loại bằng quy tắc trong `build.py → kind_of`).
