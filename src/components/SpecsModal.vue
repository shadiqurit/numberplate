<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            📋
          </div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">
            বিআরটিএ ফ্রন্ট নম্বর প্লেট স্পেসিফিকেশন (অক্টোবর ২০২৬)
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <!-- Specs Content -->
      <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <!-- Motorcycle Table -->
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div class="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>১. মোটরসাইকেল (Motorcycle) ফ্রন্ট প্লেট</span>
            <span class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">২৮৫ × ৫০ মিমি</span>
          </div>
          <div class="p-4 space-y-1 text-xs">
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">প্রস্থ ও উচ্চতা:</span>
              <strong class="text-slate-900 dark:text-white">২৮৫ মিমি × ৫০ মিমি</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">ন্যূনতম অক্ষরের উচ্চতা:</span>
              <strong class="text-slate-900 dark:text-white">২০ মিমি (বাধ্যতামূলক)</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">পটভূমি (Background):</span>
              <strong class="text-slate-900 dark:text-white">বিশুদ্ধ সাদা (#FFFFFF)</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">অক্ষরের রং (Text):</span>
              <strong class="text-slate-900 dark:text-white">বিশুদ্ধ কালো (#000000)</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">লেআউট বিন্যাস:</span>
              <strong class="text-slate-900 dark:text-white">১টি অনুভূমিক লাইন (Single horizontal line)</strong>
            </div>
            <div class="grid grid-cols-2 py-1">
              <span class="text-slate-500 dark:text-slate-400">উদাহরণ:</span>
              <strong class="font-bangla text-slate-900 dark:text-white">ঢাকা মেট্রো-ল-১১-১২২৯</strong>
            </div>
          </div>
        </div>

        <!-- Scooter Table -->
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div class="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>২. স্কুটার (Scooter) ফ্রন্ট প্লেট</span>
            <span class="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">২০০ × ১০০ মিমি</span>
          </div>
          <div class="p-4 space-y-1 text-xs">
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">প্রস্থ ও উচ্চতা:</span>
              <strong class="text-slate-900 dark:text-white">২০০ মিমি × ১০০ মিমি</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">ন্যূনতম অক্ষরের উচ্চতা:</span>
              <strong class="text-slate-900 dark:text-white">২০ মিমি (বাধ্যতামূলক)</strong>
            </div>
            <div class="grid grid-cols-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">লেআউট বিন্যাস:</span>
              <strong class="text-slate-900 dark:text-white">২টি অনুভূমিক লাইন (Multiline readable layout)</strong>
            </div>
            <div class="grid grid-cols-2 py-1">
              <span class="text-slate-500 dark:text-slate-400">উদাহরণ:</span>
              <strong class="font-bangla text-slate-900 dark:text-white">লাইন ১: ঢাকা মেট্রো-ল | লাইন ২: ১১-১২২৯</strong>
            </div>
          </div>
        </div>

        <!-- Compliance & Legal Disclaimer -->
        <div class="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl text-xs space-y-2 border border-slate-200 dark:border-slate-700">
          <h5 class="font-bold text-slate-900 dark:text-white">আইনি নির্দেশিকা ও সতর্কতা:</h5>
          <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>নম্বর প্লেটের ভেতরে কোনো প্রকার লোগো, স্লোগান, জলছাপ বা আলংকারিক বর্ডার দেওয়া সম্পূর্ণ নিষিদ্ধ।</li>
            <li>কাটিং গাইডলাইন কেবল প্লেটের সীমানার বাইরে প্রযোজ্য।</li>
            <li>এই অ্যাপ্লিকেশনটি কেবলমাত্র প্রিন্ট-রেডি আর্টওয়ার্ক তৈরির সহায়তা টুল। অফিশিয়াল নম্বর প্লেট বিআরটিএ অনুমোদিত প্রস্তুতকারী থেকে নির্দিষ্ট পদার্থ (Retro-reflective sheet / Aluminum) দ্বারা প্রস্তুত করতে হবে।</li>
          </ul>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition"
        >
          বন্ধ করুন (Close)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
