<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <!-- Screen UI (hidden during print) -->
      <div class="no-print">
        <!-- Top Navbar -->
        <Navbar
          :currentLang="currentLang"
          :isDark="isDark"
          @toggleLanguage="toggleLanguage"
          @toggleTheme="toggleTheme"
          @openSpecs="isSpecsModalOpen = true"
          @openCalibration="isCalibrationModalOpen = true"
        />

        <!-- Main Container -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <!-- Top Grid: 3-Column Layout -->
          <!-- Left: Plate Config Form | Center: Live Preview | Right: A4 Print Settings -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left: Form (lg:col-span-4) -->
            <div class="lg:col-span-4">
              <PlateConfigForm
                :currentLang="currentLang"
                :editingItem="editingItem"
                @addPlate="handleAddPlate"
                @updatePlate="handleUpdatePlate"
                @liveChange="handleLiveChange"
              />
            </div>

            <!-- Center: Live Plate Preview (lg:col-span-4) -->
            <div class="lg:col-span-4">
              <LivePlatePreview
                :currentLang="currentLang"
                :vehicleType="liveVehicleType"
                :fullNumber="liveFullNumber"
              />
            </div>

            <!-- Right: A4 Print Settings (lg:col-span-4) -->
            <div class="lg:col-span-4">
              <A4PrintSettings
                :currentLang="currentLang"
                :settings="settings"
                :layoutResult="layoutResult"
                :currentPageIndex="currentPageIndex"
                :isExportingPdf="isExportingPdf"
                @updateSetting="handleUpdateSetting"
                @triggerPrint="handlePrint"
                @exportPdf="handleExportPdf"
              />
            </div>
          </div>

          <!-- Bottom Grid: A4 Sheet Preview & Batch Manager -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- A4 Sheet Interactive Visualizer (lg:col-span-7) -->
            <div class="lg:col-span-7">
              <A4SheetPreview
                :currentLang="currentLang"
                :currentPage="currentPage"
                :currentPageIndex="currentPageIndex"
                :totalPages="layoutResult.totalPages"
                :settings="settings"
                :hasOverflowWarning="layoutResult.hasOverflowWarning"
                :warningMessage="layoutResult.warningMessage"
                @changePage="handlePageChange"
              />
            </div>

            <!-- Batch Manager List (lg:col-span-5) -->
            <div class="lg:col-span-5">
              <BatchManager
                :currentLang="currentLang"
                :plates="plates"
                @changeQuantity="handleChangeQuantity"
                @movePlate="handleMovePlate"
                @editPlate="handleEditPlate"
                @duplicatePlate="handleDuplicatePlate"
                @deletePlate="handleDeletePlate"
                @clearAll="handleClearAll"
              />
            </div>
          </div>

          <!-- Footer & Disclaimer -->
          <footer class="pt-6 pb-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p>{{ t.disclaimer }}</p>
            <p class="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              Bangladesh BRTA Front Plate Designer • October 2026 Standards • 100% Vector & High-DPI Output
            </p>
          </footer>
        </main>

        <!-- Modals -->
        <SpecsModal
          :isOpen="isSpecsModalOpen"
          @close="isSpecsModalOpen = false"
        />

        <CalibrationModal
          :isOpen="isCalibrationModalOpen"
          @close="isCalibrationModalOpen = false"
        />
      </div>

      <!-- Native Print View (Only visible during print) -->
      <PrintView
        :pages="layoutResult.pages"
        :settings="settings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import A4PrintSettings from './components/A4PrintSettings.vue';
import A4SheetPreview from './components/A4SheetPreview.vue';
import BatchManager from './components/BatchManager.vue';
import CalibrationModal from './components/CalibrationModal.vue';
import LivePlatePreview from './components/LivePlatePreview.vue';
import Navbar from './components/Navbar.vue';
import PlateConfigForm from './components/PlateConfigForm.vue';
import PrintView from './components/PrintView.vue';
import SpecsModal from './components/SpecsModal.vue';
import { DEFAULT_PRINT_SETTINGS } from './constants/brta';
import { Language, translations } from './locales/i18n';
import { PlateItem, PrintSettings, VehicleType } from './types';
import { calculateA4Layout } from './utils/layoutEngine';
import { exportLayoutToPdf } from './utils/pdfExport';

// Internationalization & Theme
const currentLang = ref<Language>('bn');
const isDark = ref(false);

const t = computed(() => translations[currentLang.value]);

function toggleLanguage() {
  currentLang.value = currentLang.value === 'bn' ? 'en' : 'bn';
  localStorage.setItem('brta_lang', currentLang.value);
}

function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.setItem('brta_dark', isDark.value ? 'true' : 'false');
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Live preview states from current form input
const liveVehicleType = ref<VehicleType>('motorcycle');
const liveFullNumber = ref('ঢাকা মেট্রো-ল-১১-১২২৯');
const editingItem = ref<PlateItem | null>(null);

// Print Batch
const defaultInitialPlates: PlateItem[] = [
  {
    id: 'sample-1',
    vehicleType: 'motorcycle',
    area: 'ঢাকা মেট্রো',
    series: 'ল',
    numberGroup: '১১',
    serial: '১২২৯',
    fullNumber: 'ঢাকা মেট্রো-ল-১১-১২২৯',
    isManualOverride: false,
    quantity: 1,
    createdAt: Date.now() - 3000,
  },
  {
    id: 'sample-2',
    vehicleType: 'motorcycle',
    area: 'ঢাকা মেট্রো',
    series: 'হ',
    numberGroup: '১২',
    serial: '৩৪৫৬',
    fullNumber: 'ঢাকা মেট্রো-হ-১২-৩৪৫৬',
    isManualOverride: false,
    quantity: 1,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'sample-3',
    vehicleType: 'scooter',
    area: 'ঢাকা মেট্রো',
    series: 'দ',
    numberGroup: '১১',
    serial: '৫৬৭৮',
    fullNumber: 'ঢাকা মেট্রো-দ-১১-৫৬৭৮',
    isManualOverride: false,
    quantity: 1,
    createdAt: Date.now() - 1000,
  },
];

const plates = ref<PlateItem[]>([]);

// Print settings
const settings = ref<PrintSettings>({ ...DEFAULT_PRINT_SETTINGS });

// Pagination
const currentPageIndex = ref(1);

// Modals
const isSpecsModalOpen = ref(false);
const isCalibrationModalOpen = ref(false);
const isExportingPdf = ref(false);

// Layout calculation
const layoutResult = computed(() => {
  return calculateA4Layout(plates.value, settings.value);
});

// Clamp currentPageIndex if pages change
watch(
  () => layoutResult.value.totalPages,
  (totalPages) => {
    if (currentPageIndex.value > totalPages) {
      currentPageIndex.value = Math.max(1, totalPages);
    }
  }
);

const currentPage = computed(() => {
  const pages = layoutResult.value.pages;
  const idx = Math.min(Math.max(0, currentPageIndex.value - 1), pages.length - 1);
  return pages[idx] || pages[0];
});

// Handlers
function handleLiveChange(data: { vehicleType: VehicleType; fullNumber: string }) {
  liveVehicleType.value = data.vehicleType;
  liveFullNumber.value = data.fullNumber;
}

function handleAddPlate(plateData: Omit<PlateItem, 'id' | 'createdAt'>) {
  const newItem: PlateItem = {
    ...plateData,
    id: 'plate_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: Date.now(),
  };
  plates.value.unshift(newItem);
  savePlatesToStorage();
}

function handleUpdatePlate(updated: PlateItem) {
  const index = plates.value.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    plates.value[index] = updated;
    savePlatesToStorage();
  }
  editingItem.value = null;
}

function handleEditPlate(item: PlateItem) {
  editingItem.value = { ...item };
  // Scroll up to form smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleChangeQuantity(id: string, newQty: number) {
  const plate = plates.value.find((p) => p.id === id);
  if (plate) {
    plate.quantity = Math.max(1, newQty);
    savePlatesToStorage();
  }
}

function handleDuplicatePlate(item: PlateItem) {
  const copy: PlateItem = {
    ...item,
    id: 'plate_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: Date.now(),
  };
  const idx = plates.value.findIndex((p) => p.id === item.id);
  if (idx !== -1) {
    plates.value.splice(idx + 1, 0, copy);
  } else {
    plates.value.push(copy);
  }
  savePlatesToStorage();
}

function handleMovePlate(fromIdx: number, toIdx: number) {
  if (fromIdx < 0 || fromIdx >= plates.value.length || toIdx < 0 || toIdx >= plates.value.length) return;
  const item = plates.value.splice(fromIdx, 1)[0];
  plates.value.splice(toIdx, 0, item);
  savePlatesToStorage();
}

function handleDeletePlate(id: string) {
  plates.value = plates.value.filter((p) => p.id !== id);
  savePlatesToStorage();
}

function handleClearAll() {
  if (confirm(t.value.resetBatchConfirm)) {
    plates.value = [];
    savePlatesToStorage();
  }
}

function handleUpdateSetting(key: keyof PrintSettings, val: any) {
  (settings.value as any)[key] = val;
}

function handlePageChange(newPage: number) {
  currentPageIndex.value = Math.max(1, Math.min(newPage, layoutResult.value.totalPages));
}

function handlePrint() {
  window.print();
}

async function handleExportPdf() {
  if (layoutResult.value.totalPlates === 0) return;
  try {
    isExportingPdf.value = true;
    await exportLayoutToPdf(layoutResult.value.pages, settings.value);
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Failed to generate PDF. Check browser console.');
  } finally {
    isExportingPdf.value = false;
  }
}

function savePlatesToStorage() {
  try {
    localStorage.setItem('brta_plates_batch', JSON.stringify(plates.value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('brta_plates_batch');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        plates.value = parsed;
        return;
      }
    }
  } catch (e) {
    console.error('Failed to load batch from localStorage:', e);
  }
  plates.value = [...defaultInitialPlates];
}

onMounted(() => {
  // Load language preference
  const savedLang = localStorage.getItem('brta_lang') as Language | null;
  if (savedLang === 'bn' || savedLang === 'en') {
    currentLang.value = savedLang;
  }

  // Load dark theme
  const savedDark = localStorage.getItem('brta_dark');
  if (savedDark === 'true') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }

  // Load stored plates
  loadFromStorage();
});
</script>
