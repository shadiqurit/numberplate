export type VehicleType = 'motorcycle' | 'scooter';

export interface PlateDimensions {
  widthMm: number;
  heightMm: number;
  minCharHeightMm: number;
  borderRadiusMm: number;
  borderThicknessMm: number;
}

export interface PlateItem {
  id: string;
  vehicleType: VehicleType;
  area: string;
  customArea?: string;
  series: string;
  numberGroup: string;
  serial: string;
  fullNumber: string;
  isManualOverride: boolean;
  quantity: number;
  createdAt: number;
}

export type PaperOrientation = 'auto' | 'portrait' | 'landscape';
export type LayoutMode = 'auto' | 'single' | 'multiple';

export interface PrintSettings {
  orientation: PaperOrientation;
  layoutMode: LayoutMode;
  marginMm: number;
  gapHorizontalMm: number;
  gapVerticalMm: number;
  showCuttingGuides: boolean;
  showCalibrationRuler: boolean;
  showDimensionsOverlay: boolean;
  showOuterBorder: boolean;
  outerBorderThicknessMm: number;
}

export interface PlacedPlate {
  plate: PlateItem;
  instanceIndex: number;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  rotation: 0 | 90;
}

export interface LayoutPage {
  pageIndex: number;
  orientation: 'portrait' | 'landscape';
  widthMm: number;
  heightMm: number;
  plates: PlacedPlate[];
  totalPlatesOnPage: number;
  usedAreaMm2: number;
  totalAreaMm2: number;
  utilizationPercentage: number;
}

export interface LayoutCalculationResult {
  pages: LayoutPage[];
  totalPages: number;
  totalPlates: number;
  effectiveOrientation: 'portrait' | 'landscape';
  hasOverflowWarning: boolean;
  warningMessage?: string;
}

export interface ComplianceValidation {
  isValid: boolean;
  estimatedCharHeightMm: number;
  meetsMinCharHeight: boolean;
  textOverflows: boolean;
  errors: string[];
  warnings: string[];
}
