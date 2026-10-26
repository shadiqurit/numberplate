import jsPDF from 'jspdf';
import { LayoutPage, PrintSettings } from '../types';
import { generatePageSvg, generateSinglePlateSvg } from './svgGenerator';

/**
 * Converts an SVG string into a High-DPI HTML5 Canvas (300 DPI)
 * 300 DPI = 300 / 25.4 ≈ 11.811 pixels per mm
 */
export async function svgToCanvas(
  svgString: string,
  widthMm: number,
  heightMm: number,
  dpi = 300
): Promise<HTMLCanvasElement> {
  const dpmm = dpi / 25.4;
  const pixelWidth = Math.round(widthMm * dpmm);
  const pixelHeight = Math.round(heightMm * dpmm);

  const canvas = document.createElement('canvas');
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Pure white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, pixelWidth, pixelHeight);

  // Convert SVG to data URI
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Downloads a complete multi-page PDF at exact 1:1 A4 physical scale
 */
export async function exportLayoutToPdf(
  pages: LayoutPage[],
  settings: PrintSettings,
  fileName = 'BRTA_Number_Plates.pdf'
): Promise<void> {
  if (pages.length === 0) return;

  const firstPage = pages[0];
  const doc = new jsPDF({
    orientation: firstPage.orientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (i > 0) {
      doc.addPage('a4', page.orientation);
    }

    const svg = generatePageSvg(page.plates, page.widthMm, page.heightMm, {
      showCuttingGuides: settings.showCuttingGuides,
      showCalibrationRuler: settings.showCalibrationRuler,
      showPlateBorder: settings.showOuterBorder,
      borderThicknessMm: settings.outerBorderThicknessMm,
    });

    const canvas = await svgToCanvas(svg, page.widthMm, page.heightMm, 300);
    const imgData = canvas.toDataURL('image/png', 1.0);

    doc.addImage(imgData, 'PNG', 0, 0, page.widthMm, page.heightMm, undefined, 'FAST');
  }

  doc.save(fileName);
}

/**
 * Downloads a single plate as SVG file
 */
export function downloadSvgFile(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Downloads a single plate as high-DPI PNG
 */
export async function downloadPlatePng(
  plateSvg: string,
  widthMm: number,
  heightMm: number,
  filename: string,
  dpi = 300
): Promise<void> {
  const canvas = await svgToCanvas(plateSvg, widthMm, heightMm, dpi);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
