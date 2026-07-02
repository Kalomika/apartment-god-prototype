#!/usr/bin/env python3
"""Panel-based Apartment God reference sprite extraction.

This script intentionally avoids full-sheet contour/blob extraction. It crops known
panels and pose slots from reference sheets, preserves complete figures/action
clusters, and outputs white-matte linework PNGs plus registries/contact sheets.
"""
from __future__ import annotations

import json
import math
import shutil
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "apartment-god-production" / "REFERENCE_LIBRARY"
OUT = ROOT / "public" / "assets" / "production_pass_reference_sheet_01"
REPORT_ROOT = ROOT / "apartment-god-production" / "generated_runtime_assets" / "reference_sheet_extraction_pass"
CONTACT = REPORT_ROOT / "contact_sheets"

DAILY = REF / "02_human_realistic_topdown_linework" / "HUMAN_REF_06_DAILY_ACTION_LINEWORK.jpg"
MOVE = REF / "02_human_realistic_topdown_linework" / "HUMAN_REF_07_STOCK_TOPDOWN_MOVEMENT_SHEET.jpg"
MIXED = REF / "02_human_realistic_topdown_linework" / "HUMAN_REF_01_MIXED_TOPDOWN_POSES_FULL_SHEET.png"
DOG = REF / "03_dog_references" / "DOG_REF_01_TOPDOWN_ANIMAL_POSE_SHEET.jpg"
ENV = REF / "01_environment_references" / "ENV_REF_02_DARK_CYBERPUNK_APARTMENT_MAP.jpg"
ENV_ALT = REF / "01_environment_references" / "ENV_REF_01_TOPDOWN_APARTMENT_MAP.jpg"

BASE_DAILY_SIZE = (1486, 1024)
# Clean ST19-ST36 daily sheet panel layout, measured from the user-approved reference sheet.
COLS = [(24, 365), (379, 720), (734, 1075), (1090, 1453)]
ROWS = [(69, 250), (263, 439), (453, 628), (641, 816), (830, 1004)]
STATE_POS = {
    "ST19": (0, 0), "ST20": (0, 1), "ST21": (0, 2), "ST22": (0, 3),
    "ST23": (1, 0), "ST24": (1, 1), "ST25": (1, 2), "ST26": (1, 3),
    "ST27": (2, 0), "ST28": (2, 1), "ST29": (2, 2), "ST30": (2, 3),
    "ST31": (3, 0), "ST32": (3, 1), "ST33": (3, 2), "ST34": (3, 3),
    "ST35": (4, 0), "ST36": (4, 1),
}

@dataclass
class RegistryEntry:
    filename: str
    path: str
    category: str
    source_reference_image: str
    source_panel_or_state: str
    extraction_method: str
    cleanup_method: str
    mirrored: bool
    intended_runtime_use: str
    fallback_behavior: str
    visual_qa_status: str = "pending"

registry: list[RegistryEntry] = []
notes: list[str] = []


def ensure_dirs() -> None:
    for sub in ["environment", "male", "female", "dog", "joint"]:
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    CONTACT.mkdir(parents=True, exist_ok=True)
    REPORT_ROOT.mkdir(parents=True, exist_ok=True)


def open_source(path: Path, fallback: Path | None = None) -> Image.Image:
    if path.exists():
        return Image.open(path).convert("RGB")
    if fallback and fallback.exists():
        notes.append(f"Missing {path.name}; used fallback {fallback.name}")
        return Image.open(fallback).convert("RGB")
    raise FileNotFoundError(f"Missing required source image: {path}")


def scale_box(box: tuple[int, int, int, int], src_size: tuple[int, int], base_size: tuple[int, int] = BASE_DAILY_SIZE) -> tuple[int, int, int, int]:
    bw, bh = base_size
    sw, sh = src_size
    x1, y1, x2, y2 = box
    return (round(x1 * sw / bw), round(y1 * sh / bh), round(x2 * sw / bw), round(y2 * sh / bh))


def panel_box(state: str, src_size: tuple[int, int]) -> tuple[int, int, int, int]:
    row, col = STATE_POS[state]
    x1, x2 = COLS[col]
    y1, y2 = ROWS[row]
    return scale_box((x1, y1, x2, y2), src_size)


def pose_slot_box(panel: tuple[int, int, int, int], slot: int) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = panel
    w = x2 - x1
    h = y2 - y1
    # Remove title line and A/B/C labels. Keep the full action cluster inside each pose slot.
    content_x1 = x1 + round(w * 0.035)
    content_x2 = x2 - round(w * 0.035)
    content_y1 = y1 + round(h * 0.26)
    content_y2 = y2 - round(h * 0.16)
    slot_w = (content_x2 - content_x1) / 3
    sx1 = round(content_x1 + slot_w * slot + slot_w * 0.03)
    sx2 = round(content_x1 + slot_w * (slot + 1) - slot_w * 0.03)
    return (sx1, content_y1, sx2, content_y2)


def crop_state_slot(img: Image.Image, state: str, slot_letter: str = "B") -> Image.Image:
    slot = {"A": 0, "B": 1, "C": 2}[slot_letter]
    return img.crop(pose_slot_box(panel_box(state, img.size), slot))


def trim_white(im: Image.Image, pad: int = 8) -> Image.Image:
    rgb = im.convert("RGB")
    # Find non-white bounding box, but keep the whole action cluster and a white matte. This is not contour extraction.
    gray = ImageOps.grayscale(rgb)
    # Anything meaningfully darker than white counts as linework or furniture.
    mask = gray.point(lambda p: 255 if p < 248 else 0)
    bbox = mask.getbbox()
    if not bbox:
        return rgb
    x1, y1, x2, y2 = bbox
    x1 = max(0, x1 - pad)
    y1 = max(0, y1 - pad)
    x2 = min(rgb.width, x2 + pad)
    y2 = min(rgb.height, y2 + pad)
    return rgb.crop((x1, y1, x2, y2))


def white_card(im: Image.Image, target: tuple[int, int] = (144, 144)) -> Image.Image:
    im = trim_white(im)
    im = ImageOps.autocontrast(im.convert("RGB"), cutoff=1)
    im = ImageEnhance.Sharpness(im).enhance(1.25)
    tw, th = target
    scale = min((tw - 12) / im.width, (th - 12) / im.height)
    nw = max(1, round(im.width * scale))
    nh = max(1, round(im.height * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    card = Image.new("RGBA", target, (255, 255, 255, 255))
    card.alpha_composite(im.convert("RGBA"), ((tw - nw) // 2, (th - nh) // 2))
    return card


def save_asset(im: Image.Image, category: str, filename: str, source: Path, state: str, method: str, intended: str, mirrored: bool = False) -> None:
    out_path = OUT / category / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)
    im.save(out_path)
    registry.append(RegistryEntry(
        filename=filename,
        path=str(out_path.relative_to(ROOT)).replace("\\", "/"),
        category=category,
        source_reference_image=str(source.relative_to(ROOT)).replace("\\", "/") if source.exists() else str(source),
        source_panel_or_state=state,
        extraction_method=method,
        cleanup_method="panel crop, label/border exclusion, white matte, auto-contrast, gameplay resize",
        mirrored=mirrored,
        intended_runtime_use=intended,
        fallback_behavior="If missing or rejected by visual QA, use existing procedural fallback.",
    ))


def mirror_asset(src_category: str, src_file: str, dst_file: str, state: str, intended: str) -> None:
    im = Image.open(OUT / src_category / src_file).convert("RGBA")
    mirrored = ImageOps.mirror(im)
    save_asset(mirrored, src_category, dst_file, MOVE, state, "mirrored from matching side-direction full-body frame", intended, mirrored=True)


def make_daily_assets() -> None:
    img = open_source(DAILY, MIXED)
    daily_map = [
        ("male", "male_laptop_desk_typing_b.png", "ST19", "B", "resident laptop desk typing"),
        ("male", "male_laptop_lap_b.png", "ST20", "B", "resident laptop on lap"),
        ("male", "male_phone_standing_b.png", "ST21", "B", "resident standing phone"),
        ("male", "male_phone_seated_b.png", "ST22", "B", "resident seated phone"),
        ("male", "male_read_book_b.png", "ST23", "B", "resident reading"),
        ("male", "male_eat_table_b.png", "ST24", "B", "resident eating"),
        ("male", "male_cook_counter_b.png", "ST25", "B", "resident cooking counter"),
        ("male", "male_sink_wash_b.png", "ST26", "B", "resident sink wash"),
        ("male", "male_toilet_b.png", "ST27", "B", "resident toilet"),
        ("male", "male_shower_b.png", "ST28", "B", "resident shower"),
        ("male", "male_pet_dog_b.png", "ST34", "B", "resident pet dog"),
        ("male", "male_play_pet_b.png", "ST35", "B", "resident play with dog"),
        ("joint", "joint_hug_standing_b.png", "ST29", "B", "joint standing hug"),
        ("joint", "joint_kiss_hold_close_b.png", "ST30", "B", "joint kiss hold close"),
        ("joint", "joint_cuddle_couch_b.png", "ST31", "B", "joint couch cuddle"),
        ("joint", "joint_cuddle_bed_b.png", "ST32", "B", "joint bed cuddle"),
        ("joint", "joint_rest_bed_awake_b.png", "ST33", "B", "joint rest in bed awake"),
        ("joint", "joint_pet_dog_b.png", "ST34", "B", "joint pet dog"),
    ]
    for category, filename, state, slot, intended in daily_map:
        card = white_card(crop_state_slot(img, state, slot), (160, 160) if category == "joint" else (144, 144))
        save_asset(card, category, filename, DAILY, f"{state}-{slot}", "fixed ST panel and pose-slot crop", intended)

    # Female first pass uses the same top-down linework poses as a neutral black-line white-matte base.
    for source_file, female_file in [
        ("male_laptop_desk_typing_b.png", "female_laptop_desk_typing_b.png"),
        ("male_laptop_lap_b.png", "female_laptop_lap_b.png"),
        ("male_phone_standing_b.png", "female_phone_standing_b.png"),
        ("male_phone_seated_b.png", "female_phone_seated_b.png"),
        ("male_read_book_b.png", "female_read_book_b.png"),
        ("male_eat_table_b.png", "female_eat_table_b.png"),
        ("male_cook_counter_b.png", "female_cook_counter_b.png"),
        ("male_sink_wash_b.png", "female_sink_wash_b.png"),
        ("male_pet_dog_b.png", "female_pet_dog_b.png"),
        ("male_play_pet_b.png", "female_play_pet_b.png"),
    ]:
        im = Image.open(OUT / "male" / source_file).convert("RGBA")
        save_asset(im, "female", female_file, DAILY, "matched daily action pose", "copied from matching top-down pose for female placeholder base, documented for later female-specific cleanup", female_file.replace(".png", ""))

    # Runtime aliases used by the existing loader.
    aliases = {
        "male_laptop_b.png": "male_laptop_desk_typing_b.png",
        "male_phone_b.png": "male_phone_standing_b.png",
        "male_eat_b.png": "male_eat_table_b.png",
        "male_sit_b.png": "male_phone_seated_b.png",
        "female_laptop_b.png": "female_laptop_desk_typing_b.png",
        "female_phone_b.png": "female_phone_standing_b.png",
        "female_eat_b.png": "female_eat_table_b.png",
        "female_sit_b.png": "female_phone_seated_b.png",
    }
    for alias, source_file in aliases.items():
        cat = "female" if alias.startswith("female") else "male"
        im = Image.open(OUT / cat / source_file).convert("RGBA")
        save_asset(im, cat, alias, DAILY, "runtime alias", "runtime alias of extracted daily action sprite", alias.replace(".png", ""))


def grid_crop(img: Image.Image, row: int, col: int, rows: int, cols: int, margin_x: float = 0.06, margin_y: float = 0.12) -> Image.Image:
    w, h = img.size
    x0 = round(w * margin_x)
    x1 = round(w * (1 - margin_x))
    y0 = round(h * margin_y)
    y1 = round(h * (1 - 0.06))
    cell_w = (x1 - x0) / cols
    cell_h = (y1 - y0) / rows
    pad_x = cell_w * 0.08
    pad_y = cell_h * 0.08
    return img.crop((round(x0 + col * cell_w + pad_x), round(y0 + row * cell_h + pad_y), round(x0 + (col + 1) * cell_w - pad_x), round(y0 + (row + 1) * cell_h - pad_y)))


def make_walk_assets() -> None:
    img = open_source(MOVE, MIXED)
    # Use complete-cell crops from the movement sheet. Avoid contour detection.
    directions = {
        "south": 0,
        "east": 1,
        "north": 2,
    }
    for prefix in ["male", "female"]:
        for direction, row in directions.items():
            for idx, letter in enumerate("abcd"):
                crop = grid_crop(img, row=min(row, 3), col=idx, rows=4, cols=4)
                card = white_card(crop, (132, 132))
                save_asset(card, prefix, f"{prefix}_walk_{direction}_{letter}.png", MOVE, f"movement {direction} frame {letter.upper()}", "fixed grid cell crop from movement sheet", f"{prefix} walk {direction} frame {letter.upper()}")
        for letter in "abcd":
            mirror_asset(prefix, f"{prefix}_walk_east_{letter}.png", f"{prefix}_walk_west_{letter}.png", f"movement west frame {letter.upper()}", f"{prefix} walk west frame {letter.upper()}")
        # Idle and sleep are useful runtime defaults.
        shutil.copyfile(OUT / prefix / f"{prefix}_walk_south_b.png", OUT / prefix / f"{prefix}_idle_a.png")
        save_asset(Image.open(OUT / prefix / f"{prefix}_idle_a.png"), prefix, f"{prefix}_idle_a.png", MOVE, "idle alias", "alias from standing/walk crop", f"{prefix} idle A")
        shutil.copyfile(OUT / prefix / f"{prefix}_walk_south_c.png", OUT / prefix / f"{prefix}_idle_b.png")
        save_asset(Image.open(OUT / prefix / f"{prefix}_idle_b.png"), prefix, f"{prefix}_idle_b.png", MOVE, "idle alias", "alias from alternate standing/walk crop", f"{prefix} idle B")

    # Sleep crops from daily ST33 if available.
    daily = open_source(DAILY, MIXED)
    for prefix in ["male", "female"]:
        card = white_card(crop_state_slot(daily, "ST33", "B"), (160, 120))
        save_asset(card, prefix, f"{prefix}_sleep_b.png", DAILY, "ST33-B", "fixed bed/rest panel crop", f"{prefix} sleep/rest")


def make_dog_assets() -> None:
    img = open_source(DOG, None)
    names = [
        "dog_idle_a.png", "dog_idle_b.png", "dog_walk_south_a.png", "dog_walk_south_b.png", "dog_walk_south_c.png", "dog_walk_south_d.png",
        "dog_walk_east_a.png", "dog_walk_east_b.png", "dog_walk_east_c.png", "dog_walk_east_d.png", "dog_sit_b.png", "dog_sleep_b.png", "dog_pet_interaction_b.png", "dog_play_b.png",
    ]
    # Dog sheet is wide; crop 2 rows x 7 columns as full cells.
    for i, name in enumerate(names):
        row = 0 if i < 7 else 1
        col = i % 7
        crop = grid_crop(img, row=row, col=col, rows=2, cols=7, margin_x=0.03, margin_y=0.12)
        card = white_card(crop, (120, 120))
        save_asset(card, "dog", name, DOG, f"dog sheet cell r{row}c{col}", "fixed grid cell crop from dog reference sheet", name.replace(".png", ""))
    # West aliases from east frames for runtime compatibility.
    for letter in "abcd":
        mirror_asset("dog", f"dog_walk_east_{letter}.png", f"dog_walk_west_{letter}.png", f"dog west frame {letter.upper()}", f"dog walk west frame {letter.upper()}")
    # North aliases from south if no distinct north dog row is available.
    for letter in "abcd":
        shutil.copyfile(OUT / "dog" / f"dog_walk_south_{letter}.png", OUT / "dog" / f"dog_walk_north_{letter}.png")
        save_asset(Image.open(OUT / "dog" / f"dog_walk_north_{letter}.png"), "dog", f"dog_walk_north_{letter}.png", DOG, f"dog north alias {letter.upper()}", "aliased from south dog crop pending directional dog sheet", f"dog walk north frame {letter.upper()}")


def make_environment_assets() -> None:
    img = open_source(ENV, ENV_ALT)
    img = ImageOps.autocontrast(img, cutoff=1)
    base = Image.new("RGBA", (960, 720), (18, 22, 30, 255))
    fitted = ImageOps.contain(img.convert("RGBA"), (900, 660), Image.Resampling.LANCZOS)
    base.alpha_composite(fitted, ((960 - fitted.width) // 2, (720 - fitted.height) // 2))
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, 959, 719), outline=(0, 220, 255, 160), width=4)
    draw.line((30, 690, 930, 690), fill=(255, 0, 180, 125), width=3)
    env_names = ["floor1_base.png", "floor2_base.png", "living_room_base.png", "kitchen_base.png", "bedroom_base.png", "office_base.png", "bathroom_base.png", "walls_dark_base.png", "neon_lighting_overlay.png"]
    for idx, name in enumerate(env_names):
        layer = base.copy()
        if name == "floor2_base.png":
            layer = ImageEnhance.Brightness(layer).enhance(0.84)
        if name == "neon_lighting_overlay.png":
            overlay = Image.new("RGBA", (960, 720), (0, 0, 0, 0))
            od = ImageDraw.Draw(overlay)
            for y in [70, 190, 330, 510, 650]:
                od.line((40, y, 920, y), fill=(0, 235, 255, 95), width=3)
            for x in [90, 280, 510, 760, 900]:
                od.line((x, 40, x, 690), fill=(255, 0, 185, 75), width=2)
            layer = overlay
        save_asset(layer, "environment", name, ENV if ENV.exists() else ENV_ALT, "environment reference map", "reference map contained/resized with cyberpunk dark base and neon overlay logic", name.replace(".png", ""))


def make_registry_and_reports() -> None:
    (OUT / "ASSET_REGISTRY.json").write_text(json.dumps({"schema_version": "1.0", "pass": "production_pass_reference_sheet_01", "entries": [asdict(e) for e in registry]}, indent=2), encoding="utf-8")
    report = [
        "# Asset Creation Report",
        "",
        "Pass: production_pass_reference_sheet_01",
        "Method: panel-based reference sheet extraction, not contour/blob extraction.",
        "production_pass_01: rejected for visual mismatch and disabled by default.",
        f"Runtime PNG count: {len(registry)}",
        "",
        "## Sources",
        f"- {DAILY.relative_to(ROOT) if DAILY.exists() else DAILY}",
        f"- {MOVE.relative_to(ROOT) if MOVE.exists() else MOVE}",
        f"- {DOG.relative_to(ROOT) if DOG.exists() else DOG}",
        f"- {ENV.relative_to(ROOT) if ENV.exists() else ENV}",
        "",
        "## Notes",
        "- Black linework on white matte is intentional for this pass.",
        "- Female first-pass daily actions may reuse the same neutral top-down linework poses until female-specific sheets are added.",
        "- Walk cycles are four-frame A/B/C/D loops where A/C are opposing contact poses and B/D are passing or half-extension approximations.",
    ]
    if notes:
        report += ["", "## Warnings"] + [f"- {n}" for n in notes]
    (REPORT_ROOT / "ASSET_CREATION_REPORT.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    (REPORT_ROOT / "REFERENCE_MAPPING.md").write_text("# Reference Mapping\n\n" + "\n".join(f"- {e.filename}: {e.source_panel_or_state} from {e.source_reference_image}" for e in registry) + "\n", encoding="utf-8")
    (REPORT_ROOT / "VISUAL_QA_NOTES.md").write_text("# Visual QA Notes\n\nReady for visual QA: yes\nReady for final art approval: no\nReady for game testing behind fallback: yes\n\nReject any crop that shows labels, borders, or incomplete random fragments.\n", encoding="utf-8")
    (REPORT_ROOT / "WALK_CYCLE_NOTES.md").write_text("# Walk Cycle Notes\n\nA = one foot full extension/contact.\nB = passing or half extension.\nC = opposite foot full extension/contact.\nD = passing or half extension.\n\nWest-facing frames are mirrored from east-facing frames when no better distinct west source exists.\n", encoding="utf-8")


def contact_sheet(title: str, entries: Iterable[RegistryEntry], out_path: Path, thumb: tuple[int, int] = (120, 120), cols: int = 6) -> None:
    entries = list(entries)
    if not entries:
        return
    rows = math.ceil(len(entries) / cols)
    cell_w, cell_h = thumb[0] + 40, thumb[1] + 42
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h + 40), (238, 240, 238))
    draw = ImageDraw.Draw(sheet)
    draw.text((12, 10), title, fill=(0, 0, 0))
    for idx, e in enumerate(entries):
        r, c = divmod(idx, cols)
        x, y = c * cell_w + 20, r * cell_h + 40
        im = Image.open(ROOT / e.path).convert("RGBA")
        im.thumbnail(thumb, Image.Resampling.LANCZOS)
        card = Image.new("RGB", thumb, (255, 255, 255))
        card.paste(im.convert("RGB"), ((thumb[0]-im.width)//2, (thumb[1]-im.height)//2))
        sheet.paste(card, (x, y))
        label = e.filename.replace(".png", "")[:24]
        draw.text((x, y + thumb[1] + 4), label, fill=(0, 0, 0))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)


def make_contact_sheets() -> None:
    contact_sheet("Human daily actions", [e for e in registry if e.category in ("male", "female") and "walk" not in e.filename and "idle" not in e.filename], CONTACT / "human_daily_actions_contact_sheet.png", cols=5)
    contact_sheet("Human 4-frame walk cycles", [e for e in registry if e.category in ("male", "female") and "walk" in e.filename], CONTACT / "walk_cycle_contact_sheet.png", cols=8)
    contact_sheet("Dog sprites", [e for e in registry if e.category == "dog"], CONTACT / "dog_contact_sheet.png", cols=6)
    contact_sheet("Environment sprites", [e for e in registry if e.category == "environment"], CONTACT / "environment_contact_sheet.png", thumb=(180, 120), cols=3)
    contact_sheet("Full reference sheet extraction pass", registry, CONTACT / "full_contact_sheet.png", cols=6)


def main() -> None:
    ensure_dirs()
    make_daily_assets()
    make_walk_assets()
    make_dog_assets()
    make_environment_assets()
    make_registry_and_reports()
    make_contact_sheets()
    print(f"Generated {len(registry)} runtime PNG assets in {OUT}")
    print(f"Generated contact sheets in {CONTACT}")


if __name__ == "__main__":
    main()
