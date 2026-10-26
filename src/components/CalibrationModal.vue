<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            📏
          </div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">
            ১০০ মিমি প্রিন্ট স্কেল ক্যালিব্রেশন নির্দেশিকা
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          বাংলাদেশ বিআরটিএ-এর নিয়ম অনুযায়ী নম্বর প্লেটের সঠিক মাপ (Motorcycle: <strong>২৮৫ × ৫০ মিমি</strong>, Scooter: <strong>২০০ × ১০০ মিমি</strong>) বজায় রাখা অত্যন্ত আবশ্যক।
        </p>

        <div class="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
          <h4 class="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider">
            কীভাবে মাপ যাচাই করবেন:
          </h4>
          <ol class="list-decimal list-inside space-y-1 text-xs">
            <li>এ৪ পাতায় প্রিন্ট করার পর পাতার নিচে একটি <strong>১০০ মিমি (১০ সেমি)</strong> রেফারেন্স রুলার থাকবে।</li>
            <li>সাধারণ স্কেল বা রুলার দিয়ে সেই বারটি মেপে দেখুন।</li>
            <li>যদি বারটির মাপ ঠিক ১০০ মিমি হয়, তবে প্লেটগুলোর মাপও ১০০% নির্ভুল ও সঠিক আছে।</li>
          </ol>
        </div>

        <div class="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs text-amber-900 dark:text-amber-300">
          <strong class="block">⚠️ গুরুত্বপূর্ণ প্রিন্ট সেটিংস:</strong>
          <div>• প্রিন্ট ডায়ালগে <strong>"Fit to page"</strong> বন্ধ রাখুন।</div>
          <div>• স্কেল (Scale) অপশনে <strong>"Actual Size"</strong> বা <strong>"100%"</strong> নির্বাচন করুন।</div>
          <div>• মার্জিন <strong>"None"</strong> অথবা <strong>"Default"</strong> রাখুন।</div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition"
        >
          বুঝেছি (Close)
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
