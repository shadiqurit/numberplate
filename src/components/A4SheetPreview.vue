<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
    <!-- Header with pagination and zoom -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          4
        </div>
        <div>
          <h2 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
            {{ t.a4Preview }}
          </h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            A4 ({{ currentPage.widthMm }} × {{ currentPage.heightMm }} মিমি) • {{ currentPage.orientation === 'landscape' ? 'ল্যান্ডস্কেপ' : 'পোর্ট্রেট' }}
          </span>
        </div>
      </div>

      <!-- Pagination & Sheet Zoom Controls -->
      <div class="flex items-center space-x-3">
        <!-- Pagination controls -->
        <div class="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            type="button"
            :disabled="currentPageIndex <= 1"
            @click="$emit('changePage', currentPageIndex - 1)"
            class="px-2 py-1 text-xs font-semibold rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
            :title="t.prevPage"
          >
            ← {{ currentLang === 'bn' ? 'আগের' : 'Prev' }}
          </button>
          <span class="px-2 text-xs font-bold font-mono text-slate-900 dark:text-white">
            {{ currentPageIndex }} / {{ totalPages }}
          </span>
          <button
            type="button"
            :disabled="currentPageIndex >= totalPages"
            @click="$emit('changePage', currentPageIndex + 1)"
            class="px-2 py-1 text-xs font-semibold rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
            :title="t.nextPage"
          >
            {{ currentLang === 'bn' ? 'পরের' : 'Next' }} →
          </button>
        </div>

        <!-- Zoom Slider -->
        <div class="hidden sm:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span>জুম:</span>
          <input
            type="range"
            min="0.35"
            max="1.0"
            step="0.05"
            v-model.number="zoomScale"
            class="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span class="font-mono w-10 text-right">{{ Math.round(zoomScale * 100) }}%</span>
        </div>
      </div>
    </div>

    <!-- Overflow notice if any -->
    <div
      v-if="hasOverflowWarning"
      class="text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50 flex items-center space-x-2"
    >
      <svg class="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ warningMessage }}</span>
    </div>

    <!-- Paper Viewport Container -->
    <div class="bg-slate-200 dark:bg-slate-950 rounded-xl p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[420px]">
      <div
        class="transition-transform origin-top flex items-center justify-center"
        :style="{ transform: `scale(${zoomScale})` }"
      >
        <!-- The A4 Sheet (Physical MM Aspect Ratio converted to SVG display) -->
        <div
          class="bg-white text-black shadow-2xl rounded-sm border border-slate-300 relative select-none"
          :style="{
            width: `${currentPage.widthMm * 2.8}px`,
            height: `${currentPage.heightMm * 2.8}px`,
          }"
        >
          <!-- SVG containing the page layout -->
          <div
            v-html="renderedPageSvg"
            class="w-full h-full"
          ></div>
        </div>
      </div>
    </div>

    <!-- Bottom Info -->
    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
      <div class="flex items-center space-x-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span>এই পাতায় রয়েছে: <strong class="text-slate-900 dark:text-white font-mono">{{ currentPage.totalPlatesOnPage }}</strong> টি প্লেট</span>
      </div>
      <div>
        <span>স্থান ব্যবহার: <strong class="text-slate-900 dark:text-white font-mono">{{ currentPage.utilizationPercentage }}%</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Language, translations } from '../locales/i18n';
import { LayoutPage, PrintSettings } from '../types';
import { generatePageSvg } from '../utils/svgGenerator';

const props = defineProps<{
  currentLang: Language;
  currentPage: LayoutPage;
  currentPageIndex: number;
  totalPages: number;
  settings: PrintSettings;
  hasOverflowWarning: boolean;
  warningMessage?: string;
}>();

defineEmits<{
  (e: 'changePage', newPage: number): void;
}>();

const t = computed(() => translations[props.currentLang]);
const zoomScale = ref(0.75);

const renderedPageSvg = computed(() => {
  return generatePageSvg(
    props.currentPage.plates,
    props.currentPage.widthMm,
    props.currentPage.heightMm,
    {
      showCuttingGuides: props.settings.showCuttingGuides,
      showCalibrationRuler: props.settings.showCalibrationRuler,
      showPlateBorder: props.settings.showOuterBorder,
      borderThicknessMm: props.settings.outerBorderThicknessMm,
    }
  );
});
</script>
