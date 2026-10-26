import { A4_DIMENSIONS, PLATE_SPECS } from '../constants/brta';
import {
  LayoutCalculationResult,
  LayoutMode,
  LayoutPage,
  PaperOrientation,
  PlacedPlate,
  PlateItem,
  PrintSettings,
} from '../types';

/**
 * Packs plates into A4 pages based on physical millimeters without shrinking plates.
 */
export function calculateA4Layout(
  plates: PlateItem[],
  settings: PrintSettings
): LayoutCalculationResult {
  // Expand plate quantities into individual instances
  const flatItems: { plate: PlateItem; instanceIndex: number }[] = [];
  for (const p of plates) {
    const qty = Math.max(1, p.quantity || 1);
    for (let i = 0; i < qty; i++) {
      flatItems.push({ plate: p, instanceIndex: i + 1 });
    }
  }

  if (flatItems.length === 0) {
    const effectiveOrientation =
      settings.orientation === 'auto' ? 'landscape' : settings.orientation;
    const pageDims = A4_DIMENSIONS[effectiveOrientation];
    return {
      pages: [
        {
          pageIndex: 1,
          orientation: effectiveOrientation,
          widthMm: pageDims.widthMm,
          heightMm: pageDims.heightMm,
          plates: [],
          totalPlatesOnPage: 0,
          usedAreaMm2: 0,
          totalAreaMm2: pageDims.widthMm * pageDims.heightMm,
          utilizationPercentage: 0,
        },
      ],
      totalPages: 1,
      totalPlates: 0,
      effectiveOrientation,
      hasOverflowWarning: false,
    };
  }

  // Determine orientation
  // Motorcycle plate is 285mm wide. A4 portrait is only 210mm wide.
  // Unless rotated 90 degrees, motorcycle MUST be on landscape.
  const hasMotorcycle = flatItems.some((item) => item.plate.vehicleType === 'motorcycle');

  let chosenOrientation: 'portrait' | 'landscape';
  let hasOverflowWarning = false;
  let warningMessage: string | undefined;

  if (settings.orientation === 'auto') {
    if (hasMotorcycle) {
      chosenOrientation = 'landscape';
    } else {
      // Scooter 200x100mm fits naturally in portrait (210 x 297mm)
      chosenOrientation = 'portrait';
    }
  } else {
    chosenOrientation = settings.orientation;
    if (chosenOrientation === 'portrait' && hasMotorcycle) {
      hasOverflowWarning = true;
      warningMessage =
        'Motorcycle plate (285 mm wide) exceeds A4 Portrait width (210 mm). Auto-rotating plates 90° or switching to Landscape is strongly recommended.';
    }
  }

  const pageWidthMm = A4_DIMENSIONS[chosenOrientation].widthMm;
  const pageHeightMm = A4_DIMENSIONS[chosenOrientation].heightMm;
  const pageAreaMm2 = pageWidthMm * pageHeightMm;

  const margin = Math.max(2, settings.marginMm ?? 6);
  const gapX = Math.max(2, settings.gapHorizontalMm ?? 5);
  const gapY = Math.max(2, settings.gapVerticalMm ?? 5);

  const availableWidth = pageWidthMm - 2 * margin;
  const availableHeight = pageHeightMm - 2 * margin;

  const pages: LayoutPage[] = [];

  if (settings.layoutMode === 'single') {
    // 1 plate per page, centered
    flatItems.forEach((item, idx) => {
      const spec = PLATE_SPECS[item.plate.vehicleType];
      let width = spec.widthMm;
      let height = spec.heightMm;
      let rotation: 0 | 90 = 0;

      // If motorcycle on portrait, rotate 90 degrees to fit
      if (chosenOrientation === 'portrait' && width > availableWidth) {
        if (width <= availableHeight && height <= availableWidth) {
          rotation = 90;
          const temp = width;
          width = height;
          height = temp;
        }
      }

      const x = Math.max(margin, (pageWidthMm - width) / 2);
      const y = Math.max(margin, (pageHeightMm - height) / 2);

      const placed: PlacedPlate = {
        plate: item.plate,
        instanceIndex: item.instanceIndex,
        xMm: Number(x.toFixed(2)),
        yMm: Number(y.toFixed(2)),
        widthMm: spec.widthMm,
        heightMm: spec.heightMm,
        rotation,
      };

      const usedArea = spec.widthMm * spec.heightMm;
      pages.push({
        pageIndex: idx + 1,
        orientation: chosenOrientation,
        widthMm: pageWidthMm,
        heightMm: pageHeightMm,
        plates: [placed],
        totalPlatesOnPage: 1,
        usedAreaMm2: usedArea,
        totalAreaMm2: pageAreaMm2,
        utilizationPercentage: Number(((usedArea / pageAreaMm2) * 100).toFixed(1)),
      });
    });
  } else {
    // Auto-fit / Multiple packing
    // We use a Shelf Bin-Packing algorithm for placing rectangular plates
    let currentPageIndex = 1;
    let currentPlaced: PlacedPlate[] = [];
    let currentUsedArea = 0;

    // Shelf tracking
    let currentX = margin;
    let currentY = margin;
    let currentShelfHeight = 0;

    const startNewPage = () => {
      if (currentPlaced.length > 0) {
        pages.push({
          pageIndex: currentPageIndex,
          orientation: chosenOrientation,
          widthMm: pageWidthMm,
          heightMm: pageHeightMm,
          plates: [...currentPlaced],
          totalPlatesOnPage: currentPlaced.length,
          usedAreaMm2: currentUsedArea,
          totalAreaMm2: pageAreaMm2,
          utilizationPercentage: Number(((currentUsedArea / pageAreaMm2) * 100).toFixed(1)),
        });
        currentPageIndex++;
        currentPlaced = [];
        currentUsedArea = 0;
        currentX = margin;
        currentY = margin;
        currentShelfHeight = 0;
      }
    };

    for (let i = 0; i < flatItems.length; i++) {
      const item = flatItems[i];
      const spec = PLATE_SPECS[item.plate.vehicleType];
      let plateW = spec.widthMm;
      let plateH = spec.heightMm;
      let rotation: 0 | 90 = 0;

      // Check if standard orientation fits width
      if (plateW > availableWidth) {
        // Can it fit if rotated 90 degrees?
        if (plateH <= availableWidth && plateW <= availableHeight) {
          rotation = 90;
          plateW = spec.heightMm;
          plateH = spec.widthMm;
        } else {
          // Doesn't physically fit within page dimensions!
          hasOverflowWarning = true;
          warningMessage = `Plate ${item.plate.fullNumber} (${spec.widthMm}x${spec.heightMm}mm) physically exceeds printable paper area!`;
        }
      }

      // Check if item fits on current shelf
      if (currentX + plateW <= pageWidthMm - margin) {
        // Fits on current shelf
        currentPlaced.push({
          plate: item.plate,
          instanceIndex: item.instanceIndex,
          xMm: Number(currentX.toFixed(2)),
          yMm: Number(currentY.toFixed(2)),
          widthMm: spec.widthMm,
          heightMm: spec.heightMm,
          rotation,
        });
        currentUsedArea += spec.widthMm * spec.heightMm;
        currentX += plateW + gapX;
        currentShelfHeight = Math.max(currentShelfHeight, plateH);
      } else {
        // Need to move to next shelf (new row)
        const nextY = currentY + currentShelfHeight + gapY;
        if (nextY + plateH <= pageHeightMm - margin) {
          // Fits on new row of current page
          currentX = margin;
          currentY = nextY;
          currentShelfHeight = plateH;

          currentPlaced.push({
            plate: item.plate,
            instanceIndex: item.instanceIndex,
            xMm: Number(currentX.toFixed(2)),
            yMm: Number(currentY.toFixed(2)),
            widthMm: spec.widthMm,
            heightMm: spec.heightMm,
            rotation,
          });
          currentUsedArea += spec.widthMm * spec.heightMm;
          currentX += plateW + gapX;
        } else {
          // Does not fit on current page, start new page
          startNewPage();

          // Place as first item on new page
          currentPlaced.push({
            plate: item.plate,
            instanceIndex: item.instanceIndex,
            xMm: Number(currentX.toFixed(2)),
            yMm: Number(currentY.toFixed(2)),
            widthMm: spec.widthMm,
            heightMm: spec.heightMm,
            rotation,
          });
          currentUsedArea += spec.widthMm * spec.heightMm;
          currentX += plateW + gapX;
          currentShelfHeight = plateH;
        }
      }
    }

    // Flush last page
    startNewPage();
  }

  // If plates were placed, return them, otherwise provide at least one empty page
  if (pages.length === 0) {
    pages.push({
      pageIndex: 1,
      orientation: chosenOrientation,
      widthMm: pageWidthMm,
      heightMm: pageHeightMm,
      plates: [],
      totalPlatesOnPage: 0,
      usedAreaMm2: 0,
      totalAreaMm2: pageAreaMm2,
      utilizationPercentage: 0,
    });
  }

  return {
    pages,
    totalPages: pages.length,
    totalPlates: flatItems.length,
    effectiveOrientation: chosenOrientation,
    hasOverflowWarning,
    warningMessage,
  };
}
