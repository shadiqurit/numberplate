import { PlateDimensions, VehicleType } from '../types';

export const A4_DIMENSIONS = {
  portrait: { widthMm: 210, heightMm: 297 },
  landscape: { widthMm: 297, heightMm: 210 },
};

export const PLATE_SPECS: Record<VehicleType, PlateDimensions> = {
  motorcycle: {
    widthMm: 285,
    heightMm: 50,
    minCharHeightMm: 20,
    borderRadiusMm: 4,
    borderThicknessMm: 1.5,
  },
  scooter: {
    widthMm: 200,
    heightMm: 100,
    minCharHeightMm: 20,
    borderRadiusMm: 5,
    borderThicknessMm: 1.5,
  },
};

export const BRTA_AREAS: { labelBn: string; labelEn: string; value: string }[] = [
  { labelBn: 'ঢাকা মেট্রো', labelEn: 'Dhaka Metro', value: 'ঢাকা মেট্রো' },
  { labelBn: 'চট্টগ্রাম মেট্রো', labelEn: 'Chattogram Metro', value: 'চট্টগ্রাম মেট্রো' },
  { labelBn: 'সিলেট মেট্রো', labelEn: 'Sylhet Metro', value: 'সিলেট মেট্রো' },
  { labelBn: 'রাজশাহী মেট্রো', labelEn: 'Rajshahi Metro', value: 'রাজশাহী মেট্রো' },
  { labelBn: 'খুলনা মেট্রো', labelEn: 'Khulna Metro', value: 'খুলনা মেট্রো' },
  { labelBn: 'বরিশাল মেট্রো', labelEn: 'Barishal Metro', value: 'বরিশাল মেট্রো' },
  { labelBn: 'রংপুর মেট্রো', labelEn: 'Rangpur Metro', value: 'রংপুর মেট্রো' },
  { labelBn: 'ময়মনসিংহ মেট্রো', labelEn: 'Mymensingh Metro', value: 'ময়মনসিংহ মেট্রো' },
  { labelBn: 'গাজীপুর', labelEn: 'Gazipur', value: 'গাজীপুর' },
  { labelBn: 'নারায়ণগঞ্জ', labelEn: 'Narayanganj', value: 'নারায়ণগঞ্জ' },
  { labelBn: 'কুমিল্লা', labelEn: 'Cumilla', value: 'কুমিল্লা' },
  { labelBn: 'বগুড়া', labelEn: 'Bogura', value: 'বগুড়া' },
  { labelBn: 'যশোর', labelEn: 'Jashore', value: 'যশোর' },
  { labelBn: 'টাঙ্গাইল', labelEn: 'Tangail', value: 'টাঙ্গাইল' },
  { labelBn: 'পাবনা', labelEn: 'Pabna', value: 'পাবনা' },
  { labelBn: 'দিনাজপুর', labelEn: 'Dinajpur', value: 'দিনাজপুর' },
  { labelBn: 'কুষ্টিয়া', labelEn: 'Kushtia', value: 'কুষ্টিয়া' },
  { labelBn: 'ফরিদপুর', labelEn: 'Faridpur', value: 'ফরিদপুর' },
  { labelBn: 'নোয়াখালী', labelEn: 'Noakhali', value: 'নোয়াখালী' },
  { labelBn: 'ব্রাহ্মণবাড়িয়া', labelEn: 'Brahmanbaria', value: 'ব্রাহ্মণবাড়িয়া' },
  { labelBn: 'কক্সবাজার', labelEn: 'Cox\'s Bazar', value: 'কক্সবাজার' },
  { labelBn: 'অন্যান্য (কাস্টম)', labelEn: 'Other (Custom)', value: 'CUSTOM' },
];

export const BRTA_SERIES: { char: string; nameEn: string; popular?: boolean }[] = [
  { char: 'ল', nameEn: 'La (Motorcycle Standard)', popular: true },
  { char: 'হ', nameEn: 'Ha (Motorcycle)', popular: true },
  { char: 'দ', nameEn: 'Da (Scooter / 2-Wheeler)', popular: true },
  { char: 'ম', nameEn: 'Ma', popular: true },
  { char: 'ক', nameEn: 'Ka' },
  { char: 'খ', nameEn: 'Kha' },
  { char: 'গ', nameEn: 'Ga' },
  { char: 'ঘ', nameEn: 'Gha' },
  { char: 'চ', nameEn: 'Cha' },
  { char: 'ছ', nameEn: 'Chha' },
  { char: 'জ', nameEn: 'Ja' },
  { char: 'ঝ', nameEn: 'Jha' },
  { char: 'ট', nameEn: 'Ta' },
  { char: 'ঠ', nameEn: 'Tha' },
  { char: 'ড', nameEn: 'Da' },
  { char: 'ঢ', nameEn: 'Dha' },
  { char: 'ত', nameEn: 'Ta' },
  { char: 'থ', nameEn: 'Tha' },
  { char: 'ধ', nameEn: 'Dha' },
  { char: 'ন', nameEn: 'Na' },
  { char: 'প', nameEn: 'Pa' },
  { char: 'ফ', nameEn: 'Pha' },
  { char: 'ব', nameEn: 'Ba' },
  { char: 'ভ', nameEn: 'Bha' },
  { char: 'য', nameEn: 'Ya' },
  { char: 'র', nameEn: 'Ra' },
  { char: 'শ', nameEn: 'Sha' },
  { char: 'ষ', nameEn: 'Sha' },
  { char: 'স', nameEn: 'Sa' },
];

export const DIGIT_EN_TO_BN: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const DIGIT_BN_TO_EN: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export const DEFAULT_PRINT_SETTINGS = {
  orientation: 'auto' as const,
  layoutMode: 'auto' as const,
  marginMm: 6,
  gapHorizontalMm: 5,
  gapVerticalMm: 5,
  showCuttingGuides: true,
  showCalibrationRuler: true,
  showDimensionsOverlay: false,
  showOuterBorder: true,
  outerBorderThicknessMm: 1.0,
};
