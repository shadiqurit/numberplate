<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo & Title -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
          ব
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              {{ t.appTitle }}
            </h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              অক্টোবর ২০২৬
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {{ t.appSubtitle }}
          </p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <!-- Specs Info Button -->
        <button
          @click="$emit('openSpecs')"
          class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 text-xs font-medium"
          title="BRTA Specifications"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="hidden md:inline">বিআরটিএ নিয়ম</span>
        </button>

        <!-- Calibration Ruler Info -->
        <button
          @click="$emit('openCalibration')"
          class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 text-xs font-medium"
          title="Calibration Guide"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span class="hidden md:inline">স্কেল যাচাই</span>
        </button>

        <!-- Language Switcher -->
        <button
          @click="$emit('toggleLanguage')"
          class="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="t.langToggle"
        >
          {{ currentLang === 'bn' ? 'English' : 'বাংলা' }}
        </button>

        <!-- Dark/Light Theme Toggle -->
        <button
          @click="$emit('toggleTheme')"
          class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="t.themeToggle"
        >
          <!-- Sun icon when dark -->
          <svg v-if="isDark" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
          <!-- Moon icon when light -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Language, translations } from '../locales/i18n';
import { computed } from 'vue';

const props = defineProps<{
  currentLang: Language;
  isDark: boolean;
}>();

defineEmits<{
  (e: 'toggleLanguage'): void;
  (e: 'toggleTheme'): void;
  (e: 'openSpecs'): void;
  (e: 'openCalibration'): void;
}>();

const t = computed(() => translations[props.currentLang]);
</script>
