#!/usr/bin/env python3
# Sinh các trang chương trình thi từ một khuôn chung
import os

BASE = os.path.dirname(os.path.abspath(__file__))

PAGE = """<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} — English With Tom</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-page="{key}">
<div id="site-header"></div>

<section class="page-hero">
  <div class="container">
    <div class="crumb">Trang chủ › {name}</div>
    <h1>{name} <span class="tag" style="vertical-align:middle;">{level}</span></h1>
    <p>{desc}</p>
  </div>
</section>

<section class="section" style="padding-top:34px;">
  <div class="container">
    <div class="skill-grid">
{skills}
    </div>
  </div>
</section>

<div id="site-footer"></div>
<script src="js/main.js"></script>
</body>
</html>
"""

SKILL = """      <div class="skill-card">
        <h3><span class="course-ico {ico}" style="width:40px;height:40px;font-size:19px;margin:0;">{emoji}</span> {sname}</h3>
        <p>{sdesc}</p>
{rows}
      </div>"""

ROW = ('        <div class="test-row"><div><div class="name">{tn}</div>'
       '<div class="lvl">{tl}</div></div>'
       '<a class="btn btn-sm" href="practice-reading.html">Làm bài</a></div>')

def skills_block(items):
    out = []
    for s in items:
        rows = "\n".join(ROW.format(tn=t[0], tl=t[1]) for t in s["tests"])
        out.append(SKILL.format(ico=s["ico"], emoji=s["emoji"],
                                sname=s["name"], sdesc=s["desc"], rows=rows))
    return "\n".join(out)

L = ("ico-teal", "🎧", "Listening")
R = ("ico-blue", "📖", "Reading")
W = ("ico-amber", "✍️", "Writing")
S = ("ico-pink", "🗣️", "Speaking")

def std(level):
    return [
        {"ico": L[0], "emoji": L[1], "name": L[2], "desc": "Chấm tự động ngay khi nộp.",
         "tests": [("Listening Test 1", level), ("Listening Test 2", level)]},
        {"ico": R[0], "emoji": R[1], "name": R[2], "desc": "Chấm tự động ngay khi nộp.",
         "tests": [("Reading Test 1", level), ("Reading Test 2", level)]},
        {"ico": W[0], "emoji": W[1], "name": W[2], "desc": "Chấm bằng AI kèm nhận xét chi tiết.",
         "tests": [("Writing Part 1", "AI chấm"), ("Writing Part 2", "AI chấm")]},
        {"ico": S[0], "emoji": S[1], "name": S[2], "desc": "Ghi âm trả lời, AI chấm điểm.",
         "tests": [("Speaking Part 1", "Giới thiệu"), ("Speaking Part 2", "Hội thoại")]},
    ]

PAGES = {
    "ket": dict(name="KET", level="A2 Key", key="ket",
                desc="Cambridge A2 Key — trình độ sơ cấp. Xây nền tảng tiếng Anh vững chắc qua 4 kỹ năng.",
                skills=std("Trình độ A2")),
    "pet": dict(name="PET", level="B1 Preliminary", key="pet",
                desc="Cambridge B1 Preliminary — trình độ trung cấp, giao tiếp hằng ngày tự tin.",
                skills=std("Trình độ B1")),
    "fce": dict(name="FCE", level="B2 First", key="fce",
                desc="Cambridge B2 First — trình độ trung cao cấp cho học tập và làm việc bằng tiếng Anh.",
                skills=std("Trình độ B2")),
    "aptis": dict(name="APTIS", level="British Council", key="aptis",
                  desc="Bài thi APTIS của British Council — đánh giá linh hoạt theo nhu cầu công việc và học tập.",
                  skills=std("Theo nhu cầu")),
}

for key, p in PAGES.items():
    html = PAGE.format(name=p["name"], level=p["level"], key=p["key"],
                       desc=p["desc"], skills=skills_block(p["skills"]))
    with open(os.path.join(BASE, key + ".html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("Đã tạo", key + ".html")
