#!/usr/bin/env python3
"""Genera una portada 16:9 para una entrada del blog con Gemini 3 Pro Image,
on-brand (dark-tech, acento cian #37D5E7, fondo #0B0E14). Text-to-image.

Uso:  python scripts/gen_blog_cover.py <slug> "<prompt>"  [--n 2]
Guarda en:  out/covers/<slug>_<i>.png   (elige la mejor y cópiala a public/img/blog/)
La key sale de D:/rmendezdev/.env (GEMINI_API_KEY).
"""
import base64, json, os, sys, urllib.request, urllib.error

ENV = "D:/rmendezdev/.env"
MODEL = "gemini-3-pro-image"
OUT_DIR = "out/covers"

BRAND = (
    "Cinematic dark-tech editorial illustration, 16:9, photoreal-meets-graphic, premium, "
    "high contrast, moody volumetric haze, subtle film grain. Near-black background (#0B0E14, "
    "deep slate blues). ONE electric cyan accent color (#37D5E7) used sparingly as glow/light. "
    "Minimal and elegant, negative space, no text, no watermark, no logos, no captions. "
)

def key():
    with open(ENV, encoding="utf-8") as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("No GEMINI_API_KEY en " + ENV)

def gen(slug, prompt, i, k):
    payload = {
        "contents": [{"role": "user", "parts": [{"text": BRAND + prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"},
        },
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={k}"
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"),
                                headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[{i}] HTTP {e.code}: {e.read().decode('utf-8')[:600]}")
        return None
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        blob = p.get("inlineData") or p.get("inline_data")
        if blob and blob.get("data"):
            os.makedirs(OUT_DIR, exist_ok=True)
            out = os.path.join(OUT_DIR, f"{slug}_{i}.png")
            with open(out, "wb") as f:
                f.write(base64.b64decode(blob["data"]))
            print(f"[{i}] OK -> {out}")
            return out
    print(f"[{i}] sin imagen: {json.dumps(data)[:600]}")
    return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit('uso: python scripts/gen_blog_cover.py <slug> "<prompt>" [--n N]')
    slug, prompt = sys.argv[1], sys.argv[2]
    n = 2
    if "--n" in sys.argv:
        n = int(sys.argv[sys.argv.index("--n") + 1])
    k = key()
    for i in range(1, n + 1):
        gen(slug, prompt, i, k)
