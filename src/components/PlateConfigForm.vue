<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          1
        </div>
        <h2 class="font-bold text-base text-slate-900 dark:text-white">
          {{ t.plateConfig }}
        </h2>
      </div>
      <button
        @click="resetForm"
        type="button"
        class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline font-medium"
      >
        {{ t.resetForm }}
      </button>
    </div>

    <!-- Quick Presets -->
    <div class="space-y-1.5">
      <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {{ t.quickPresets }}
      </label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="(preset, idx) in presets"
          :key="idx"
          @click="applyPreset(preset)"
          type="button"
          class="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Vehicle Type Selection -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {{ t.vehicleType }} <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          @click="setVehicleType('motorcycle')"
          :class="[
            'p-3 rounded-lg border text-left flex flex-col justify-between transition-all',
            vehicleType === 'motorcycle'
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          <div class="font-bold text-sm">{{ t.motorcycleShort }}</div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">285 × 50 mm (১ লাইন)</div>
        </button>

        <button
          type="button"
          @click="setVehicleType('scooter')"
          :class="[
            'p-3 rounded-lg border text-left flex flex-col justify-between transition-all',
            vehicleType === 'scooter'
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
          ]"
        >
          <div class="font-bold text-sm">{{ t.scooterShort }}</div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">200 × 100 mm (২ লাইন)</div>
        </button>
      </div>
    </div>

    <!-- Registration Area -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {{ t.registrationArea }} <span class="text-rose-500">*</span>
      </label>
      <select
        v-model="area"
        @change="onFieldChange"
        class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
      >
        <option v-for="item in BRTA_AREAS" :key="item.value" :value="item.value">
          {{ currentLang === 'bn' ? item.labelBn : `${item.labelEn} (${item.labelBn})` }}
        </option>
      </select>

      <!-- Custom Area Field -->
      <div v-if="area === 'CUSTOM'" class="mt-2">
        <input
          v-model="customArea"
          @input="onFieldChange"
          type="text"
          :placeholder="t.customAreaPlaceholder"
          class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
        />
      </div>
    </div>

    <!-- Series -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ t.registrationSeries }} <span class="text-rose-500">*</span>
        </label>
        <span class="text-[11px] text-slate-400">যেমন: ল, হ, দ</span>
      </div>

      <!-- Quick series chips -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="s in popularSeries"
          :key="s.char"
          type="button"
          @click="selectSeries(s.char)"
          :class="[
            'w-8 h-8 rounded font-bangla font-bold text-sm flex items-center justify-center border transition',
            series === s.char
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
          ]"
        >
          {{ s.char }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <select
          v-model="series"
          @change="onFieldChange"
          class="px-3 py-2 text-sm font-bangla bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
        >
          <option v-for="s in BRTA_SERIES" :key="s.char" :value="s.char">
            {{ s.char }} ({{ s.nameEn }})
          </option>
        </select>
        <input
          v-model="series"
          @input="onFieldChange"
          type="text"
          placeholder="অন্য বর্ণ লিখুন"
          class="px-3 py-2 text-sm font-bangla bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
        />
      </div>
    </div>

    <!-- Registration Numbers: Group and Serial in 2 columns -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Group (e.g. 11 / ১১) -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ t.registrationGroup }} <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="numberGroup"
          @input="onDigitInput('numberGroup')"
          type="text"
          :placeholder="t.groupPlaceholder"
          maxlength="4"
          class="w-full px-3 py-2 text-sm font-bangla font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
        />
      </div>

      <!-- Serial (e.g. 1229 / ১২২৯) -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ t.registrationSerial }} <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="serial"
          @input="onDigitInput('serial')"
          type="text"
          :placeholder="t.serialPlaceholder"
          maxlength="6"
          class="w-full px-3 py-2 text-sm font-bangla font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
        />
      </div>
    </div>

    <p class="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded border border-emerald-200 dark:border-emerald-900/50">
      💡 {{ t.digitsConvertedNotice }}
    </p>

    <!-- Full Number Display & Manual Override -->
    <div class="space-y-1.5 pt-1">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ t.fullRegistration }}
        </label>
        <label class="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-500 dark:text-slate-400">
          <input
            type="checkbox"
            v-model="isManualOverride"
            class="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span>{{ t.manualOverride }}</span>
        </label>
      </div>

      <input
        v-model="fullNumber"
        :readonly="!isManualOverride"
        @input="onManualInput"
        type="text"
        :class="[
          'w-full px-3 py-2.5 text-base font-bangla font-bold rounded-lg border focus:outline-none transition',
          isManualOverride
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 focus:ring-2 focus:ring-amber-500'
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white',
        ]"
      />
    </div>

    <!-- Quantity & Action -->
    <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {{ t.quantity }}:
        </label>
        <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
          <button
            type="button"
            @click="quantity = Math.max(1, quantity - 1)"
            class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            -
          </button>
          <input
            type="number"
            v-model.number="quantity"
            min="1"
            max="50"
            class="w-12 text-center text-sm py-1 font-bold bg-white dark:bg-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            @click="quantity = quantity + 1"
            class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            +
          </button>
        </div>
      </div>

      <!-- Add / Update Button -->
      <button
        type="button"
        @click="submitPlate"
        :disabled="!fullNumber.trim()"
        class="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition flex items-center justify-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ editingId ? t.updatePlate : t.addToBatch }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { BRTA_AREAS, BRTA_SERIES } from '../constants/brta';
import { Language, translations } from '../locales/i18n';
import { PlateItem, VehicleType } from '../types';
import { assembleRegistrationString, toBengaliDigits } from '../utils/bengali';

const props = defineProps<{
  currentLang: Language;
  editingItem: PlateItem | null;
}>();

const emit = defineEmits<{
  (e: 'addPlate', plate: Omit<PlateItem, 'id' | 'createdAt'>): void;
  (e: 'updatePlate', plate: PlateItem): void;
  (e: 'liveChange', plateData: { vehicleType: VehicleType; fullNumber: string }): void;
}>();

const t = computed(() => translations[props.currentLang]);

// Form states
const vehicleType = ref<VehicleType>('motorcycle');
const area = ref('ঢাকা মেট্রো');
const customArea = ref('');
const series = ref('ল');
const numberGroup = ref('১১');
const serial = ref('১২২৯');
const isManualOverride = ref(false);
const fullNumber = ref('ঢাকা মেট্রো-ল-১১-১২২৯');
const quantity = ref(1);
const editingId = ref<string | null>(null);

const popularSeries = computed(() => BRTA_SERIES.filter((s) => s.popular));

// Presets
const presets = [
  { label: 'ঢাকা মেট্রো-ল-১১-১২২৯', type: 'motorcycle' as VehicleType, area: 'ঢাকা মেট্রো', series: 'ল', group: '১১', serial: '১২২৯' },
  { label: 'ঢাকা মেট্রো-হ-১২-৩৪৫৬', type: 'motorcycle' as VehicleType, area: 'ঢাকা মেট্রো', series: 'হ', group: '১২', serial: '৩৪৫৬' },
  { label: 'ঢাকা মেট্রো-দ-১১-৫৬৭৮ (স্কুটার)', type: 'scooter' as VehicleType, area: 'ঢাকা মেট্রো', series: 'দ', group: '১১', serial: '৫৬৭৮' },
  { label: 'চট্টগ্রাম মেট্রো-ল-১৩-৪৫৬৭', type: 'motorcycle' as VehicleType, area: 'চট্টগ্রাম মেট্রো', series: 'ল', group: '১৩', serial: '৪৫৬৭' },
];

function applyPreset(p: typeof presets[0]) {
  vehicleType.value = p.type;
  area.value = p.area;
  series.value = p.series;
  numberGroup.value = p.group;
  serial.value = p.serial;
  isManualOverride.value = false;
  recomputeFullNumber();
}

function setVehicleType(type: VehicleType) {
  vehicleType.value = type;
  // If switching to scooter and series was 'ল', suggest 'দ' (common scooter) if desired, or keep
  emitLive();
}

function selectSeries(s: string) {
  series.value = s;
  onFieldChange();
}

function onDigitInput(field: 'numberGroup' | 'serial') {
  if (field === 'numberGroup') {
    numberGroup.value = toBengaliDigits(numberGroup.value);
  } else {
    serial.value = toBengaliDigits(serial.value);
  }
  onFieldChange();
}

function recomputeFullNumber() {
  if (isManualOverride.value) return;
  const areaName = area.value === 'CUSTOM' ? customArea.value : area.value;
  fullNumber.value = assembleRegistrationString(areaName, series.value, numberGroup.value, serial.value);
  emitLive();
}

function onFieldChange() {
  if (!isManualOverride.value) {
    recomputeFullNumber();
  } else {
    emitLive();
  }
}

function onManualInput() {
  emitLive();
}

function emitLive() {
  emit('liveChange', {
    vehicleType: vehicleType.value,
    fullNumber: fullNumber.value,
  });
}

function resetForm() {
  vehicleType.value = 'motorcycle';
  area.value = 'ঢাকা মেট্রো';
  customArea.value = '';
  series.value = 'ল';
  numberGroup.value = '১১';
  serial.value = '১২২৯';
  isManualOverride.value = false;
  quantity.value = 1;
  editingId.value = null;
  recomputeFullNumber();
}

function submitPlate() {
  if (!fullNumber.value.trim()) return;

  const actualArea = area.value === 'CUSTOM' ? customArea.value : area.value;

  if (editingId.value && props.editingItem) {
    emit('updatePlate', {
      ...props.editingItem,
      vehicleType: vehicleType.value,
      area: actualArea,
      customArea: area.value === 'CUSTOM' ? customArea.value : undefined,
      series: series.value,
      numberGroup: numberGroup.value,
      serial: serial.value,
      fullNumber: fullNumber.value,
      isManualOverride: isManualOverride.value,
      quantity: quantity.value,
    });
    editingId.value = null;
  } else {
    emit('addPlate', {
      vehicleType: vehicleType.value,
      area: actualArea,
      customArea: area.value === 'CUSTOM' ? customArea.value : undefined,
      series: series.value,
      numberGroup: numberGroup.value,
      serial: serial.value,
      fullNumber: fullNumber.value,
      isManualOverride: isManualOverride.value,
      quantity: quantity.value,
    });
  }
}

// Watch editing item
watch(
  () => props.editingItem,
  (item) => {
    if (item) {
      editingId.value = item.id;
      vehicleType.value = item.vehicleType;
      const isCustom = !BRTA_AREAS.some((a) => a.value === item.area);
      if (isCustom) {
        area.value = 'CUSTOM';
        customArea.value = item.area;
      } else {
        area.value = item.area;
      }
      series.value = item.series;
      numberGroup.value = item.numberGroup;
      serial.value = item.serial;
      isManualOverride.value = item.isManualOverride;
      fullNumber.value = item.fullNumber;
      quantity.value = item.quantity;
      emitLive();
    }
  },
  { immediate: true }
);

// Initial live emit
emitLive();
</script>
