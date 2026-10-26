<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
    <!-- Header -->
    <div class="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
        3
      </div>
      <div>
        <h2 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
          {{ t.a4Settings }}
        </h2>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          A4 (210 × 297 mm)
        </span>
      </div>
    </div>

    <!-- Paper Orientation -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {{ t.paperOrientation }}
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="updateSetting('orientation', 'auto')"
          :class="[
            'py-2 px-2 text-xs font-semibold rounded-lg border text-center transition',
            settings.orientation === 'auto'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          {{ t.autoOrientation }}
        </button>

        <button
          type="button"
          @click="updateSetting('orientation', 'landscape')"
          :class="[
            'py-2 px-2 text-xs font-semibold rounded-lg border text-center transition',
            settings.orientation === 'landscape'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          {{ t.landscape }}
        </button>

        <button
          type="button"
          @click="updateSetting('orientation', 'portrait')"
          :class="[
            'py-2 px-2 text-xs font-semibold rounded-lg border text-center transition',
            settings.orientation === 'portrait'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          {{ t.portrait }}
        </button>
      </div>

      <p v-if="hasOrientationWarning" class="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900/40">
        ⚠️ ২৮৫ মিমি চওড়া মোটরসাইকেল প্লেট এ৪ পোর্ট্রেটের (২১০ মিমি) চেয়ে বড়। স্বয়ংক্রিয়ভাবে ল্যান্ডস্কেপ মোড ব্যবহৃত হবে।
      </p>
    </div>

    <!-- Layout Mode -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {{ t.layoutMode }}
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          @click="updateSetting('layoutMode', 'auto')"
          :class="[
            'py-2 px-2 text-xs font-semibold rounded-lg border text-center transition',
            settings.layoutMode === 'auto'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          {{ t.autoFit }}
        </button>

        <button
          type="button"
          @click="updateSetting('layoutMode', 'single')"
          :class="[
            'py-2 px-2 text-xs font-semibold rounded-lg border text-center transition',
            settings.layoutMode === 'single'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          {{ t.singlePlate }}
        </button>
      </div>
    </div>

    <!-- Spacing Controls: Margin & Gap -->
    <div class="space-y-3 pt-1">
      <div>
        <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <span>{{ t.marginMm }}</span>
          <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ settings.marginMm }} mm</span>
        </div>
        <input
          type="range"
          min="4"
          max="20"
          step="1"
          :value="settings.marginMm"
          @input="updateSetting('marginMm', Number(($event.target as HTMLInputElement).value))"
          class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>

      <div>
        <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <span>{{ t.gapMm }}</span>
          <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ settings.gapVerticalMm }} mm</span>
        </div>
        <input
          type="range"
          min="2"
          max="20"
          step="1"
          :value="settings.gapVerticalMm"
          @input="updateSetting('gapVerticalMm', Number(($event.target as HTMLInputElement).value)); updateSetting('gapHorizontalMm', Number(($event.target as HTMLInputElement).value))"
          class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>
    </div>

    <!-- Checkbox toggles: Cutting guides, Calibration scale, Border -->
    <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
      <label class="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          :checked="settings.showCuttingGuides"
          @change="updateSetting('showCuttingGuides', ($event.target as HTMLInputElement).checked)"
          class="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span>{{ t.cuttingGuides }}</span>
      </label>

      <label class="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          :checked="settings.showCalibrationRuler"
          @change="updateSetting('showCalibrationRuler', ($event.target as HTMLInputElement).checked)"
          class="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span>{{ t.calibrationRuler }}</span>
      </label>

      <label class="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          :checked="settings.showOuterBorder"
          @change="updateSetting('showOuterBorder', ($event.target as HTMLInputElement).checked)"
          class="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span>{{ t.showPlateBorder }}</span>
      </label>
    </div>

    <!-- Batch Summary Card -->
    <div class="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-3 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
      <div class="font-bold text-slate-900 dark:text-white flex items-center justify-between">
        <span>লেআউট পরিসংখ্যান:</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-mono">
          {{ layoutResult.effectiveOrientation.toUpperCase() }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
        <div>মোট প্লেট: <strong class="text-slate-900 dark:text-white font-mono">{{ layoutResult.totalPlates }}</strong> টি</div>
        <div>মোট এ৪ পাতা: <strong class="text-slate-900 dark:text-white font-mono">{{ layoutResult.totalPages }}</strong> টি</div>
        <div>পাতার দিক: <strong class="text-slate-900 dark:text-white">{{ layoutResult.effectiveOrientation === 'landscape' ? 'ল্যান্ডস্কেপ' : 'পোর্ট্রেট' }}</strong></div>
        <div>কাগজ ব্যবহার: <strong class="text-slate-900 dark:text-white font-mono">{{ currentPageUtilization }}%</strong></div>
      </div>
    </div>

    <!-- Main Export & Print Action Buttons -->
    <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      <!-- Browser Print Button -->
      <button
        type="button"
        @click="$emit('triggerPrint')"
        :disabled="layoutResult.totalPlates === 0"
        class="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>{{ t.printNow }}</span>
      </button>

      <!-- PDF Download Button -->
      <button
        type="button"
        @click="$emit('exportPdf')"
        :disabled="layoutResult.totalPlates === 0 || isExportingPdf"
        class="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 active:bg-black disabled:opacity-50 text-white font-bold text-sm shadow-sm transition flex items-center justify-center space-x-2"
      >
        <svg v-if="!isExportingPdf" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <svg v-else class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ isExportingPdf ? 'পিডিএফ তৈরি হচ্ছে...' : t.downloadPdf }}</span>
      </button>
    </div>

    <!-- Quick instructions reminder -->
    <div class="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
      <div class="font-bold text-slate-700 dark:text-slate-300">
        {{ t.printInstructionsTitle }}
      </div>
      <div>• {{ t.printInstruction1 }}</div>
      <div>• {{ t.printInstruction2 }}</div>
      <div>• {{ t.printInstruction4 }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Language, translations } from '../locales/i18n';
import { LayoutCalculationResult, PrintSettings } from '../types';

const props = defineProps<{
  currentLang: Language;
  settings: PrintSettings;
  layoutResult: LayoutCalculationResult;
  currentPageIndex: number;
  isExportingPdf: boolean;
}>();

const emit = defineEmits<{
  (e: 'updateSetting', key: keyof PrintSettings, val: any): void;
  (e: 'triggerPrint'): void;
  (e: 'exportPdf'): void;
}>();

const t = computed(() => translations[props.currentLang]);

function updateSetting(key: keyof PrintSettings, val: any) {
  emit('updateSetting', key, val);
}

const hasOrientationWarning = computed(() => {
  return (
    props.settings.orientation === 'portrait' &&
    props.layoutResult.hasOverflowWarning
  );
});

const currentPageUtilization = computed(() => {
  const page = props.layoutResult.pages[props.currentPageIndex - 1];
  return page ? page.utilizationPercentage : 0;
});
</script>
