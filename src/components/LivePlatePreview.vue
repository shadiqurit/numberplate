<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          2
        </div>
        <div>
          <h2 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
            {{ t.livePreview }}
          </h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ vehicleType === 'motorcycle' ? t.motorcycleDimensions : t.scooterDimensions }}
          </span>
        </div>
      </div>

      <!-- Compliance Badge -->
      <div class="flex items-center space-x-2">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition',
            validation.meetsMinCharHeight
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
          ]"
        >
          <span
            :class="[
              'w-2 h-2 rounded-full mr-1.5',
              validation.meetsMinCharHeight ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500',
            ]"
          ></span>
          {{ validation.meetsMinCharHeight ? t.compliant : t.nonCompliant }}
        </span>
      </div>
    </div>

    <!-- Warnings if any -->
    <div v-if="validation.warnings.length > 0" class="space-y-1">
      <div
        v-for="(w, i) in validation.warnings"
        :key="i"
        class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-start space-x-2"
      >
        <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ w }}</span>
      </div>
    </div>

    <!-- Zoom & Dimension Tools bar -->
    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <!-- Dimensions Badge -->
      <div class="flex items-center space-x-2">
        <label class="flex items-center space-x-1.5 cursor-pointer">
          <input
            type="checkbox"
            v-model="showDimensionsGuide"
            class="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span>মাপের গাইড দেখান</span>
        </label>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <span class="font-medium text-slate-700 dark:text-slate-300">
          অক্ষরের উচ্চতা: ~{{ validation.estimatedCharHeightMm }} মিমি (≥ ২০ মিমি)
        </span>
      </div>

      <!-- Zoom controls -->
      <div class="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
        <button
          type="button"
          @click="zoom = Math.max(0.6, zoom - 0.1)"
          class="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
          :title="t.zoomOut"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <span class="px-1.5 font-mono text-[11px]">{{ Math.round(zoom * 100) }}%</span>
        <button
          type="button"
          @click="zoom = Math.min(2.0, zoom + 0.1)"
          class="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
          :title="t.zoomIn"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          @click="zoom = 1.0"
          class="px-1 text-[11px] hover:bg-white dark:hover:bg-slate-700 rounded transition"
          :title="t.zoomReset"
        >
          1:1
        </button>
      </div>
    </div>

    <!-- Plate Canvas / Preview Area -->
    <!-- The physical plate is ALWAYS pure white with pure black text per BRTA specs -->
    <div class="relative bg-slate-100 dark:bg-slate-950 rounded-xl p-6 min-h-[220px] flex items-center justify-center overflow-auto border border-dashed border-slate-300 dark:border-slate-800">
      <div
        class="transition-transform origin-center"
        :style="{ transform: `scale(${zoom})` }"
      >
        <!-- The Plate Outer Container -->
        <div class="relative inline-block shadow-2xl rounded-sm">
          <!-- Rendered SVG of Plate -->
          <div
            v-html="svgMarkup"
            class="block select-none"
          ></div>

          <!-- Optional Dimension Overlay -->
          <div
            v-if="showDimensionsGuide"
            class="absolute inset-0 pointer-events-none border-2 border-emerald-500/40 rounded flex flex-col justify-between"
          >
            <!-- Top width label -->
            <div class="absolute -top-6 left-0 right-0 flex items-center justify-center">
              <span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                {{ spec.widthMm }} mm
              </span>
            </div>
            <!-- Left height label -->
            <div class="absolute -left-12 top-0 bottom-0 flex items-center justify-center">
              <span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow -rotate-90">
                {{ spec.heightMm }} mm
              </span>
            </div>
            <!-- Center min character height guide line -->
            <div class="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between border-t border-b border-rose-400/60 h-[20mm]">
              <span class="text-[9px] bg-rose-500 text-white px-1 rounded shadow">
                BRTA Min: 20 mm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Export Plate Buttons (Single Plate) -->
    <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      <span class="text-xs text-slate-500 dark:text-slate-400 mr-auto">
        এই প্লেটটি সংরক্ষণ করুন:
      </span>
      <button
        type="button"
        @click="exportSvg"
        class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center space-x-1.5"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>{{ t.downloadSvg }}</span>
      </button>

      <button
        type="button"
        @click="exportPng"
        class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center space-x-1.5"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ t.downloadPng }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PLATE_SPECS } from '../constants/brta';
import { Language, translations } from '../locales/i18n';
import { PlateItem, VehicleType } from '../types';
import { validatePlateCompliance } from '../utils/bengali';
import { downloadPlatePng, downloadSvgFile } from '../utils/pdfExport';
import { generateSinglePlateSvg } from '../utils/svgGenerator';

const props = defineProps<{
  currentLang: Language;
  vehicleType: VehicleType;
  fullNumber: string;
}>();

const t = computed(() => translations[props.currentLang]);
const spec = computed(() => PLATE_SPECS[props.vehicleType]);
const zoom = ref(1.0);
const showDimensionsGuide = ref(false);

const validation = computed(() => validatePlateCompliance(props.fullNumber, props.vehicleType));

const dummyPlate = computed<PlateItem>(() => ({
  id: 'preview',
  vehicleType: props.vehicleType,
  area: '',
  series: '',
  numberGroup: '',
  serial: '',
  fullNumber: props.fullNumber || 'ঢাকা মেট্রো-ল-১১-১২২৯',
  isManualOverride: false,
  quantity: 1,
  createdAt: Date.now(),
}));

const svgMarkup = computed(() => {
  return generateSinglePlateSvg(dummyPlate.value, {
    showBorder: true,
    borderThicknessMm: 1.0,
    embedFontStyles: true,
  });
});

function exportSvg() {
  const filename = `${props.vehicleType}_${props.fullNumber.replace(/\s+/g, '_')}.svg`;
  downloadSvgFile(svgMarkup.value, filename);
}

async function exportPng() {
  const filename = `${props.vehicleType}_${props.fullNumber.replace(/\s+/g, '_')}.png`;
  await downloadPlatePng(
    svgMarkup.value,
    spec.value.widthMm,
    spec.value.heightMm,
    filename,
    300
  );
}
</script>
