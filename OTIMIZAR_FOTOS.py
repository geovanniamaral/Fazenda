from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def optimize_image(path: Path, max_dimension: int, quality: int) -> tuple[int, int]:
    before = path.stat().st_size
    temporary = path.with_name(f"{path.stem}.otimizando{path.suffix}")

    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        extension = path.suffix.lower()

        if extension in {".jpg", ".jpeg"}:
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(
                temporary,
                format="JPEG",
                quality=quality,
                optimize=True,
                progressive=True,
            )
        elif extension == ".png":
            image.save(temporary, format="PNG", optimize=True)
        else:
            image.save(temporary, format="WEBP", quality=quality, method=6)

    temporary.replace(path)
    return before, path.stat().st_size


def main() -> None:
    parser = argparse.ArgumentParser(description="Otimiza cópias das fotos para publicação.")
    parser.add_argument("directory", type=Path)
    parser.add_argument("--max-dimension", type=int, default=1600)
    parser.add_argument("--quality", type=int, default=82)
    args = parser.parse_args()

    files = sorted(
        path
        for path in args.directory.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    total_before = 0
    total_after = 0
    optimized = 0
    for path in files:
        before, after = optimize_image(path, args.max_dimension, args.quality)
        total_before += before
        total_after += after
        optimized += 1

    saved_mb = (total_before - total_after) / (1024 * 1024)
    final_mb = total_after / (1024 * 1024)
    print(
        f"Fotos otimizadas: {optimized} | "
        f"Tamanho final: {final_mb:.2f} MB | Economia: {saved_mb:.2f} MB"
    )


if __name__ == "__main__":
    main()
