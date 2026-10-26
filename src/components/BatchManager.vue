<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          5
        </div>
        <div>
          <h2 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
            {{ t.printBatch }}
          </h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ plates.length }} টি আইটেম • সর্বমোট {{ totalCopies }} টি প্লেট
          </span>
        </div>
      </div>

      <!-- Clear All Button -->
      <button
        v-if="plates.length > 0"
        type="button"
        @click="$emit('clearAll')"
        class="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
      >
        {{ t.clearAll }}
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="plates.length === 0"
      class="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-500"
    >
      <svg class="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-xs">{{ t.batchEmpty }}</p>
    </div>

    <!-- Plates List -->
    <div v-else class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
      <div
        v-for="(item, index) in plates"
        :key="item.id"
        class="flex flex-wrap items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition"
      >
        <!-- Plate info -->
        <div class="flex items-center space-x-3 min-w-[200px]">
          <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-[11px] font-bold">
            {{ index + 1 }}
          </span>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-bangla font-bold text-sm text-slate-900 dark:text-white">
                {{ item.fullNumber }}
              </span>
              <span
                :class="[
                  'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider',
                  item.vehicleType === 'motorcycle'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
                ]"
              >
                {{ item.vehicleType === 'motorcycle' ? 'বাইক (285×50)' : 'স্কুটার (200×100)' }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">
              কপি: {{ item.quantity }} টি
            </div>
          </div>
        </div>

        <!-- Quantity Stepper & Actions -->
        <div class="flex items-center space-x-2 ml-auto">
          <!-- Quantity Control -->
          <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 overflow-hidden">
            <button
              type="button"
              @click="$emit('changeQuantity', item.id, Math.max(1, item.quantity - 1))"
              class="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              -
            </button>
            <span class="px-2 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
              {{ item.quantity }}
            </span>
            <button
              type="button"
              @click="$emit('changeQuantity', item.id, item.quantity + 1)"
              class="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              +
            </button>
          </div>

          <!-- Reorder Up/Down -->
          <button
            type="button"
            :disabled="index === 0"
            @click="$emit('movePlate', index, index - 1)"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-600 dark:text-slate-300 transition"
            :title="t.moveUp"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            :disabled="index === plates.length - 1"
            @click="$emit('movePlate', index, index + 1)"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-600 dark:text-slate-300 transition"
            :title="t.moveDown"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Edit -->
          <button
            type="button"
            @click="$emit('editPlate', item)"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            :title="t.edit"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <!-- Duplicate -->
          <button
            type="button"
            @click="$emit('duplicatePlate', item)"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            :title="t.duplicate"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <!-- Delete -->
          <button
            type="button"
            @click="$emit('deletePlate', item.id)"
            class="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
            :title="t.delete"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Language, translations } from '../locales/i18n';
import { PlateItem } from '../types';

const props = defineProps<{
  currentLang: Language;
  plates: PlateItem[];
}>();

defineEmits<{
  (e: 'changeQuantity', id: string, newQty: number): void;
  (e: 'movePlate', fromIdx: number, toIdx: number): void;
  (e: 'editPlate', item: PlateItem): void;
  (e: 'duplicatePlate', item: PlateItem): void;
  (e: 'deletePlate', id: string): void;
  (e: 'clearAll'): void;
}>();

const t = computed(() => translations[props.currentLang]);

const totalCopies = computed(() => {
  return props.plates.reduce((sum, p) => sum + (p.quantity || 1), 0);
});
</script>
