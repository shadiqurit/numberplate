import { DIGIT_BN_TO_EN, DIGIT_EN_TO_BN, PLATE_SPECS } from '../constants/brta';
import { ComplianceValidation, VehicleType } from '../types';

/**
 * Converts any ASCII digits (0-9) to Bengali digits (০-৯)
 */
export function toBengaliDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[0-9]/g, (digit) => DIGIT_EN_TO_BN[digit] || digit);
}

/**
 * Converts Bengali digits (০-৯) to ASCII digits (0-9)
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[০-৯]/g, (digit) => DIGIT_BN_TO_EN[digit] || digit);
}

/**
 * Formats full registration string according to standard BRTA format
 */
export function assembleRegistrationString(
  area: string,
  series: string,
  numberGroup: string,
  serial: string
): string {
  const cleanArea = area.trim();
  const cleanSeries = series.trim();
  const cleanGroup = toBengaliDigits(numberGroup.trim());
  const cleanSerial = toBengaliDigits(serial.trim());

  const parts = [cleanArea, cleanSeries, cleanGroup, cleanSerial].filter(Boolean);
  return parts.join('-');
}

export interface SplitRegistration {
  fullText: string;
  line1: string;
  line2?: string;
}

/**
 * Splits registration for rendering according to vehicle type
 * Motorcycle: 1 horizontal line
 * Scooter: 2 horizontal lines
 */
export function getPlateDisplayLines(
  fullNumber: string,
  vehicleType: VehicleType
): SplitRegistration {
  const trimmed = fullNumber.trim();
  if (vehicleType === 'motorcycle') {
    return {
      fullText: trimmed,
      line1: trimmed,
    };
  }

  // For scooter, break into 2 lines if possible
  // Expected standard: "ঢাকা মেট্রো-ল-১১-১২২৯" -> Line 1: "ঢাকা মেট্রো-ল", Line 2: "১১-১২২৯"
  const parts = trimmed.split('-');
  if (parts.length >= 4) {
    const line1 = `${parts[0]}-${parts[1]}`;
    const line2 = parts.slice(2).join('-');
    return {
      fullText: trimmed,
      line1,
      line2,
    };
  } else if (parts.length === 3) {
    return {
      fullText: trimmed,
      line1: `${parts[0]}-${parts[1]}`,
      line2: parts[2],
    };
  } else if (parts.length === 2) {
    return {
      fullText: trimmed,
      line1: parts[0],
      line2: parts[1],
    };
  }

  // Fallback: try splitting in middle by space or hyphen
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex !== -1) {
    return {
      fullText: trimmed,
      line1: trimmed.substring(0, spaceIndex),
      line2: trimmed.substring(spaceIndex + 1),
    };
  }

  return {
    fullText: trimmed,
    line1: trimmed,
    line2: '',
  };
}

/**
 * Validates BRTA compliance
 * - Minimum character height: 20 mm
 * - Must fit within plate boundaries
 * - Character count check
 */
export function validatePlateCompliance(
  fullNumber: string,
  vehicleType: VehicleType
): ComplianceValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const spec = PLATE_SPECS[vehicleType];

  if (!fullNumber || fullNumber.trim().length === 0) {
    return {
      isValid: false,
      estimatedCharHeightMm: 0,
      meetsMinCharHeight: false,
      textOverflows: false,
      errors: ['Registration number cannot be empty.'],
      warnings: [],
    };
  }

  const lines = getPlateDisplayLines(fullNumber, vehicleType);

  // In Bengali Noto Sans / typography:
  // Cap-height/consonant height is approx 0.70 of font size in pt/mm.
  // To have minimum character glyph height of 20 mm, the font-size must be at least ~26-28 mm (approx 74-80 pt).
  // Available height for Motorcycle: 50 mm total plate height.
  // With 50 mm plate height, 22-26 mm character height fits comfortably with padding (top/bottom ~12-14 mm margins).
  // Available width for Motorcycle: 285 mm.
  // Standard text e.g. "ঢাকা মেট্রো-ল-১১-১২২৯" has ~21 characters including hyphens.
  // At font size ~26 mm (glyph height ~20-21 mm), total text width is ~180-220 mm, which comfortably fits inside 285 mm width!

  // Available height for Scooter: 100 mm total plate height.
  // Scooter has 2 lines:
  // Line 1: "ঢাকা মেট্রো-ল" (~13 chars)
  // Line 2: "১১-১২২৯" (~7 chars)
  // Two lines of 21 mm char height require ~2 * 26mm font size + line spacing ~ 65-75 mm total text block height.
  // This fits comfortably within the 100 mm height (leaving ~12-15 mm top/bottom margins).
  // Available width for Scooter: 200 mm. Line 1 width at 26mm font size is ~135 mm, easily fitting in 200 mm!

  let targetCharHeightMm = 21; // compliant default >= 20 mm
  let textOverflows = false;

  if (vehicleType === 'motorcycle') {
    // Width check: approximate width at 21mm char height
    // Each Bengali cluster average width ~ 9.5 mm at 21mm height
    const approxWidthMm = lines.line1.length * 10.2;
    const availableWidthMm = spec.widthMm - 24; // 12mm padding each side

    if (approxWidthMm > availableWidthMm) {
      const maxFeasibleHeight = (availableWidthMm / lines.line1.length) * (21 / 10.2);
      if (maxFeasibleHeight < spec.minCharHeightMm) {
        textOverflows = true;
        warnings.push(
          `Text length is too long (${lines.line1.length} chars). To fit within 285 mm width, character height would drop below the mandatory 20 mm BRTA minimum (estimated: ${maxFeasibleHeight.toFixed(1)} mm).`
        );
      }
    }
  } else {
    // Scooter width and height check
    const line1WidthMm = (lines.line1 || '').length * 10.2;
    const line2WidthMm = (lines.line2 || '').length * 10.2;
    const maxLineWidthMm = Math.max(line1WidthMm, line2WidthMm);
    const availableWidthMm = spec.widthMm - 20;

    if (maxLineWidthMm > availableWidthMm) {
      textOverflows = true;
      warnings.push(`Scooter text is too wide for 200 mm plate at mandatory 20 mm character height.`);
    }
  }

  // Check valid Bengali characters & hyphens
  const hasLatinCharacters = /[a-zA-Z]/.test(fullNumber);
  if (hasLatinCharacters) {
    warnings.push('Latin / English alphabet detected. Official BRTA front plates require Bengali script.');
  }

  const hasEnglishDigits = /[0-9]/.test(fullNumber);
  if (hasEnglishDigits) {
    warnings.push('Contains ASCII numbers (0-9). Please convert to Bengali numerals (০-৯).');
  }

  const meetsMinCharHeight = targetCharHeightMm >= spec.minCharHeightMm && !textOverflows;

  return {
    isValid: errors.length === 0,
    estimatedCharHeightMm: targetCharHeightMm,
    meetsMinCharHeight,
    textOverflows,
    errors,
    warnings,
  };
}
