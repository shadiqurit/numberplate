# Bangladesh BRTA Front Number Plate Designer & A4 Print Generator
> **অফিশিয়াল বিআরটিএ ফ্রন্ট নম্বর প্লেট ডিজাইনার ও এ৪ প্রিন্ট প্রস্তুতকারক (অক্টোবর ২০২৬ স্পেসিফিকেশন)**

A fully-featured, client-side, production-grade web application built with **Vue 3**, **TypeScript**, **Tailwind CSS**, and **jsPDF** for generating physically accurate front registration number plates for motorcycles and scooters according to Bangladesh Road Transport Authority (BRTA) October 2026 guidelines.

---

## 🚀 Key Features

### 1. Official BRTA Physical Plate Specifications
- **Motorcycle Plate:**
  - Width: **285 mm**
  - Height: **50 mm**
  - Minimum Bengali Character Height: **20 mm**
  - Layout: Single horizontal line (e.g. `ঢাকা মেট্রো-ল-১১-১২২৯`)
  - Background: Pure White (`#FFFFFF`) | Text: Pure Black (`#000000`)
  - No decorative graphics or internal watermarks.
- **Scooter Plate:**
  - Width: **200 mm**
  - Height: **100 mm**
  - Minimum Bengali Character Height: **20 mm**
  - Layout: Multiline format (Line 1: `ঢাকা মেট্রো-ল`, Line 2: `১১-১২২৯`)
  - Satisfies minimum 20 mm glyph height without boundary overflow.

### 2. High-Precision A4 Paper Layout Engine
- **Geometric Shelf Bin-Packing:** Mathematically calculates optimal plate placement on A4 paper (210 × 297 mm) without ever shrinking plate dimensions.
- **Auto-Orientation:** Automatically selects **Landscape (297 × 210 mm)** for 285 mm motorcycle plates, preventing impossible portrait truncation.
- **Multi-Plate Batching & Mixing:** Mix multiple motorcycle and scooter registrations on the same page or across multiple paginated A4 sheets.
- **Configurable Margins & Gaps:** Customize page margins and spacing between plates.
- **Cutting Guides:** Corner crosshair marks positioned exclusively outside plate boundaries.
- **100 mm Calibration Scale:** Verifiable reference ruler to validate true 1:1 physical printing with a real-world ruler.

### 3. Real-Time Bengali Typography & Shaper
- Real-time conversion of English digits (`0–9`) to Bengali numerals (`০–৯`).
- Standard BRTA registration formats: Area + Series + Group + Serial.
- Integrated Google Fonts (`Noto Sans Bengali`) ensuring authentic Unicode conjunct shaping and vowel ligature rendering.
- Real-time character height compliance validation badge (`≥ 20 mm`).

### 4. Vector & High-DPI Print/Export Options
- **A4 Direct Browser Printing (`window.print()`):** Print stylesheet with `@page` CSS for 100% scale vector printing.
- **Multi-Page PDF Download:** High-DPI (300 DPI) millimeter-accurate PDF generation using `jsPDF`.
- **Individual Plate Vector SVG:** Single-click vector export.
- **Individual Plate PNG:** High-resolution 300 DPI raster export.

### 5. Professional UI/UX
- **Bilingual Interface:** Instant switch between Bengali (বাংলা) and English.
- **Light & Dark Themes:** Application UI adapts smoothly (the plate itself remains strictly regulation white with black lettering).
- **Batch Management:** Add, duplicate, reorder, edit, and set individual quantities per plate.
- **Local Persistence:** Automatically preserves batch data in `localStorage`.

---

## 🛠️ Technology Stack
- **Framework:** Vue 3 (Composition API with `<script setup>`)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Bundler:** Vite 6
- **PDF Engine:** jsPDF 2.5
- **Icons:** SVG & Lucide Vue Next

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher, tested on Node v24)
- npm or pnpm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
Generates production-ready, minified static assets in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 📏 Exact Print Verification Guide

To verify print scale accuracy:
1. In the print dialog, ensure **"Fit to page"** or **"Shrink to fit"** is **DISABLED**.
2. Set **Scale** to **"Actual Size"** or **100%**.
3. Set **Paper Size** to **A4**.
4. Set **Margins** to **None** or **Default**.
5. Once printed, place a physical ruler on the **100 mm Calibration Bar** printed outside the plates. If it measures exactly 10 cm / 100 mm, your plate dimensions are 100% accurate.

---

## ⚖️ Legal Disclaimer
This application generates precision print artwork in accordance with Bangladesh BRTA published guidelines. It is an independent utility tool and does not claim government certification or official government affiliation. Official motor vehicle number plates must be acquired via certified BRTA channels with authorized reflective sheeting and embossed aluminum substrates.
