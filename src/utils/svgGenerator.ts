import { PLATE_SPECS } from '../constants/brta';
import { PlacedPlate, PlateItem } from '../types';
import { getPlateDisplayLines } from './bengali';

/**
 * Generates an SVG string for a single plate with exact physical millimeter dimensions.
 */
export function generateSinglePlateSvg(
  plate: PlateItem,
  options: {
    showBorder?: boolean;
    borderThicknessMm?: number;
    embedFontStyles?: boolean;
  } = {}
): string {
  const spec = PLATE_SPECS[plate.vehicleType];
  const { widthMm, heightMm, borderRadiusMm } = spec;
  const showBorder = options.showBorder ?? true;
  const borderThickness = options.borderThicknessMm ?? 1.0;
  const lines = getPlateDisplayLines(plate.fullNumber, plate.vehicleType);

  const fontStyles = options.embedFontStyles
    ? `
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@700;800&amp;display=swap');
        .plate-bg { fill: #ffffff; }
        .plate-border { stroke: #000000; fill: none; }
        .plate-text {
          fill: #000000;
          font-family: 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', sans-serif;
          font-weight: 800;
          text-anchor: middle;
          dominant-baseline: central;
        }
      </style>
    </defs>`
    : '';

  let textSvg = '';

  if (plate.vehicleType === 'motorcycle') {
    // Motorcycle: single line centered
    // Plate width 285mm, height 50mm. Font size 26mm produces ~20-21mm glyph height.
    const fontSize = 26;
    const yCenter = heightMm / 2;
    const xCenter = widthMm / 2;

    textSvg = `
      <text x="${xCenter}" y="${yCenter}" font-size="${fontSize}" class="plate-text">
        ${escapeXml(lines.line1)}
      </text>
    `;
  } else {
    // Scooter: 2 lines centered
    // Plate width 200mm, height 100mm.
    const fontSize = 25;
    const xCenter = widthMm / 2;
    const yLine1 = 34;
    const yLine2 = 72;

    textSvg = `
      <text x="${xCenter}" y="${yLine1}" font-size="${fontSize}" class="plate-text">
        ${escapeXml(lines.line1)}
      </text>
      ${
        lines.line2
          ? `<text x="${xCenter}" y="${yLine2}" font-size="${fontSize}" class="plate-text">${escapeXml(lines.line2)}</text>`
          : ''
      }
    `;
  }

  const borderSvg = showBorder
    ? `<rect x="${borderThickness / 2}" y="${borderThickness / 2}" width="${widthMm - borderThickness}" height="${heightMm - borderThickness}" rx="${borderRadiusMm}" ry="${borderRadiusMm}" stroke-width="${borderThickness}" class="plate-border" />`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${widthMm} ${heightMm}">
  ${fontStyles}
  <rect width="${widthMm}" height="${heightMm}" rx="${borderRadiusMm}" ry="${borderRadiusMm}" class="plate-bg" />
  ${borderSvg}
  ${textSvg}
</svg>`;
}

/**
 * Escapes special XML characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an SVG string for a complete A4 page layout with cutting guides and calibration ruler
 */
export function generatePageSvg(
  placedPlates: PlacedPlate[],
  pageWidthMm: number,
  pageHeightMm: number,
  options: {
    showCuttingGuides?: boolean;
    showCalibrationRuler?: boolean;
    showPlateBorder?: boolean;
    borderThicknessMm?: number;
  } = {}
): string {
  const showGuides = options.showCuttingGuides ?? true;
  const showRuler = options.showCalibrationRuler ?? true;
  const showBorder = options.showPlateBorder ?? true;
  const borderThickness = options.borderThicknessMm ?? 1.0;

  let platesSvg = '';

  for (const placed of placedPlates) {
    const spec = PLATE_SPECS[placed.plate.vehicleType];
    const lines = getPlateDisplayLines(placed.plate.fullNumber, placed.plate.vehicleType);

    let transform = `translate(${placed.xMm}, ${placed.yMm})`;
    if (placed.rotation === 90) {
      transform += ` rotate(90) translate(0, -${spec.widthMm})`;
    }

    let textMarkup = '';
    if (placed.plate.vehicleType === 'motorcycle') {
      const fontSize = 26;
      textMarkup = `<text x="${spec.widthMm / 2}" y="${spec.heightMm / 2}" font-size="${fontSize}" class="plate-text">${escapeXml(lines.line1)}</text>`;
    } else {
      const fontSize = 25;
      textMarkup = `
        <text x="${spec.widthMm / 2}" y="34" font-size="${fontSize}" class="plate-text">${escapeXml(lines.line1)}</text>
        ${lines.line2 ? `<text x="${spec.widthMm / 2}" y="72" font-size="${fontSize}" class="plate-text">${escapeXml(lines.line2)}</text>` : ''}
      `;
    }

    // Cutting marks around the plate (corner tick marks 3mm outside plate)
    let cuttingMarksSvg = '';
    if (showGuides) {
      const markLen = 4;
      const offset = 1.5;
      const x0 = 0 - offset;
      const y0 = 0 - offset;
      const x1 = spec.widthMm + offset;
      const y1 = spec.heightMm + offset;

      cuttingMarksSvg = `
        <g stroke="#64748b" stroke-width="0.35" stroke-dasharray="none">
          <!-- Top Left -->
          <line x1="${x0 - markLen}" y1="${0}" x2="${x0}" y2="${0}" />
          <line x1="${0}" y1="${y0 - markLen}" x2="${0}" y2="${y0}" />
          <!-- Top Right -->
          <line x1="${x1}" y1="${0}" x2="${x1 + markLen}" y2="${0}" />
          <line x1="${spec.widthMm}" y1="${y0 - markLen}" x2="${spec.widthMm}" y2="${y0}" />
          <!-- Bottom Left -->
          <line x1="${x0 - markLen}" y1="${spec.heightMm}" x2="${x0}" y2="${spec.heightMm}" />
          <line x1="${0}" y1="${y1}" x2="${0}" y2="${y1 + markLen}" />
          <!-- Bottom Right -->
          <line x1="${x1}" y1="${spec.heightMm}" x2="${x1 + markLen}" y2="${spec.heightMm}" />
          <line x1="${spec.widthMm}" y1="${y1}" x2="${spec.widthMm}" y2="${y1 + markLen}" />
        </g>
      `;
    }

    platesSvg += `
      <g transform="${transform}">
        ${cuttingMarksSvg}
        <rect width="${spec.widthMm}" height="${spec.heightMm}" rx="${spec.borderRadiusMm}" ry="${spec.borderRadiusMm}" fill="#ffffff" />
        ${
          showBorder
            ? `<rect x="${borderThickness / 2}" y="${borderThickness / 2}" width="${spec.widthMm - borderThickness}" height="${spec.heightMm - borderThickness}" rx="${spec.borderRadiusMm}" ry="${spec.borderRadiusMm}" stroke="#000000" stroke-width="${borderThickness}" fill="none" />`
            : ''
        }
        ${textMarkup}
      </g>
    `;
  }

  // Calibration Ruler (100 mm bar)
  let rulerSvg = '';
  if (showRuler) {
    const rx = 10;
    const ry = pageHeightMm - 10;
    const barWidth = 100;
    const barHeight = 4;

    let ticks = '';
    for (let cm = 0; cm <= 10; cm++) {
      const tx = rx + cm * 10;
      const tickH = cm % 5 === 0 ? 3.5 : 2;
      ticks += `<line x1="${tx}" y1="${ry - tickH}" x2="${tx}" y2="${ry}" stroke="#000000" stroke-width="0.3" />`;
      if (cm === 0 || cm === 5 || cm === 10) {
        ticks += `<text x="${tx}" y="${ry - tickH - 1}" font-size="2.5" fill="#475569" font-family="sans-serif" text-anchor="middle">${cm * 10}</text>`;
      }
    }

    rulerSvg = `
      <g id="calibration-ruler">
        <rect x="${rx}" y="${ry}" width="${barWidth}" height="${barHeight}" fill="#0f172a" />
        ${ticks}
        <text x="${rx + barWidth + 4}" y="${ry + 3}" font-size="2.6" fill="#334155" font-family="sans-serif">
          100 mm Calibration Check (Print at 100% / Actual Size)
        </text>
      </g>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${pageWidthMm}mm" height="${pageHeightMm}mm" viewBox="0 0 ${pageWidthMm} ${pageHeightMm}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@700;800&amp;display=swap');
      .plate-text {
        fill: #000000;
        font-family: 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', sans-serif;
        font-weight: 800;
        text-anchor: middle;
        dominant-baseline: central;
      }
    </style>
  </defs>
  <rect width="${pageWidthMm}" height="${pageHeightMm}" fill="#ffffff" />
  ${platesSvg}
  ${rulerSvg}
</svg>`;
}
