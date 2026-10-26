<template>
  <div class="print-only">
    <div
      v-for="(page, pageIdx) in pages"
      :key="pageIdx"
      class="print-page relative bg-white text-black overflow-hidden"
      :style="{
        width: `${page.widthMm}mm`,
        height: `${page.heightMm}mm`,
      }"
    >
      <div
        v-html="renderSvg(page)"
        class="w-full h-full"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutPage, PrintSettings } from '../types';
import { generatePageSvg } from '../utils/svgGenerator';

const props = defineProps<{
  pages: LayoutPage[];
  settings: PrintSettings;
}>();

function renderSvg(page: LayoutPage) {
  return generatePageSvg(page.plates, page.widthMm, page.heightMm, {
    showCuttingGuides: props.settings.showCuttingGuides,
    showCalibrationRuler: props.settings.showCalibrationRuler,
    showPlateBorder: props.settings.showOuterBorder,
    borderThicknessMm: props.settings.outerBorderThicknessMm,
  });
}
</script>

<style>
@media print {
  @page {
    size: A4 auto;
    margin: 0;
  }
}
</style>
