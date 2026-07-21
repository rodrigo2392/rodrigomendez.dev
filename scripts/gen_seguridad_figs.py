#!/usr/bin/env python3
"""Portada + figuras de seccion para la entrada "Seguridad para vibecoders".
Reusa la identidad dark-tech del blog (cian #37D5E7 sobre #0B0E14).

Uso:  python scripts/gen_seguridad_figs.py [nombre]   # sin arg genera todas
Guarda PNG en out/covers/ ; luego se convierten a JPG a public/img/blog/.
"""
import base64, json, os, sys, urllib.request, urllib.error

ENV = "D:/rmendezdev/.env"
MODEL = "gemini-3-pro-image"
OUT_DIR = "out/covers"

BRAND = (
    "Cinematic dark-tech editorial illustration, 16:9, photoreal-meets-graphic, premium, "
    "high contrast, moody volumetric haze, subtle film grain. Near-black background (#0B0E14, "
    "deep slate blues). ONE electric cyan accent color (#37D5E7) used sparingly as glow/light. "
    "Minimal and elegant, negative space, no text, no watermark, no logos, no captions, "
    "no letters or numbers anywhere in the image. "
)

FIGS = {
    # Portada: la metafora central del post, defensa en capas
    "portada-a": (
        "A single glowing cyan cube of data suspended at the center, protected by several "
        "concentric translucent glass shells around it, like nested armor layers seen in "
        "cross-section. Each outer shell is progressively more cracked and breached, while the "
        "innermost shell remains intact and brightly lit. Dramatic side lighting, deep shadows, "
        "sense of depth and scale. Architectural, elegant, cinematic wide shot."
    ),
    "portada-b": (
        "Cross-section of a dark futuristic vault built as several concentric walls, seen from a "
        "low three-quarter angle. Tiny cyan light trails attack from the outside; most are "
        "absorbed and scattered by the outer walls, a few pierce deeper, none reach the glowing "
        "cyan core at the center. Volumetric fog between layers, strong cinematic depth."
    ),
    # Capa 1: codigo, la llave expuesta
    "fig-codigo": (
        "Extreme close-up of a small brass key glowing hot cyan, accidentally embedded inside a "
        "translucent wall of abstract flowing code-like geometry (blurred, unreadable, no legible "
        "characters). Dozens of tiny distant drone lights converge toward the key from the dark "
        "background, like insects drawn to light. Shallow depth of field, tense mood."
    ),
    # Capa 3: IDOR, puertas identicas
    "fig-puertas": (
        "A long dark corridor lined with dozens of identical closed metal doors receding into "
        "vanishing point. One single door stands ajar, spilling bright cyan light across the "
        "floor, revealing it was never actually locked. Symmetrical one-point perspective, "
        "cinematic, unsettling calm, volumetric light shafts."
    ),
    # Capa 4: datos y archivos expuestos
    "fig-boveda": (
        "A massive dark server vault of stacked glass drawers holding glowing cyan data shards. "
        "One drawer at eye level hangs completely open and unguarded, its light spilling out into "
        "the dark aisle while every other drawer is sealed. Wide cinematic shot, cold industrial "
        "atmosphere, strong sense of one careless mistake."
    ),
    # Capa 6: infraestructura, el escudo contra el DDoS
    "fig-escudo": (
        "An enormous swarm of thousands of tiny hostile light particles rushing from the right "
        "toward a single small structure on the left, stopped mid-air by a vast translucent cyan "
        "hexagonal shield dome that scatters them into sparks. Behind the shield, calm and dark. "
        "Epic scale contrast, cinematic, volumetric haze."
    ),
}


def key():
    with open(ENV, encoding="utf-8") as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("No GEMINI_API_KEY en " + ENV)


def gen(name, prompt, k):
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
        print(f"[{name}] HTTP {e.code}: {e.read().decode('utf-8')[:600]}")
        return None
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        blob = p.get("inlineData") or p.get("inline_data")
        if blob and blob.get("data"):
            os.makedirs(OUT_DIR, exist_ok=True)
            out = os.path.join(OUT_DIR, f"seguridad_{name}.png")
            with open(out, "wb") as f:
                f.write(base64.b64decode(blob["data"]))
            print(f"[{name}] OK -> {out}")
            return out
    print(f"[{name}] sin imagen: {json.dumps(data)[:600]}")
    return None


if __name__ == "__main__":
    k = key()
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, prompt in FIGS.items():
        if only and name != only:
            continue
        gen(name, prompt, k)
