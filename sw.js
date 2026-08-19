
const CACHE_NAME = 'alam-alaqwas-v2'; // قمنا بتغيير الإصدار لضمان التحديث
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // تحديث المسارات هنا لاستخدام .wav بدلاً من .mp3
  './audio/takbeer.wav',
  './audio/bee.wav',
  './audio/rain.wav',
  './audio/birds.wav'
];

// تثبيت ملفات التخزين المؤقت
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // حذف التخزين المؤقت القديم إذا وجد
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      });
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// تشغيل التطبيق من الذاكرة المحلية عند عدم وجود إنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
