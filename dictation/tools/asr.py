# Bước 1: nhận dạng giọng nói (có mốc thời gian từng từ) cho các đoạn nghe nguồn trong /tmp/ewt-dict/units.json (xem units.py)
# Dùng faster-whisper (chạy trên máy dev, KHÔNG chạy trên server). Kết quả: /tmp/ewt-dict/asr/<id>.json
# Chạy song song:  asr.py small.en --worker 0/4 ... 3/4
import sys, os, json, subprocess, argparse
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
from faster_whisper import WhisperModel
OUT = '/tmp/ewt-dict/asr'; WAV = '/tmp/ewt-dict/wav'
os.makedirs(OUT, exist_ok=True); os.makedirs(WAV, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument('model', nargs='?', default='small.en'); ap.add_argument('--worker', default=''); ap.add_argument('--threads', type=int, default=2); ap.add_argument('--lv', default='')
a = ap.parse_args()
model = WhisperModel(a.model, device='cpu', compute_type='int8', cpu_threads=a.threads)
units = json.load(open('/tmp/ewt-dict/units.json'))
if a.lv: units = [u for u in units if u['lv'] == a.lv]
if a.worker: k, n = map(int, a.worker.split('/')); units = [u for i, u in enumerate(units) if i % n == k]
for i, u in enumerate(units):
    cid = u['id']; out = f'{OUT}/{cid}.json'
    if os.path.exists(out): continue
    wav = f'{WAV}/{cid}.wav'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', u['audio'], '-ac', '1', '-ar', '16000', wav], check=True)
    segs, info = model.transcribe(wav, language='en', word_timestamps=True, condition_on_previous_text=False, beam_size=5, temperature=0.0)
    words = []
    for s in segs:
        for w in s.words or []:
            words.append({'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2), 'p': round(w.probability, 3)})
    json.dump({'id': cid, 'dur': round(info.duration, 2), 'words': words}, open(out, 'w'), ensure_ascii=False)
    print(i + 1, len(units), cid, len(words), flush=True)
print('DONE', flush=True)
