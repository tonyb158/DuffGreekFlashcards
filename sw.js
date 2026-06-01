const CACHE_NAME = "greek-flashcards-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json"
];

console.log("Greek Flashcards app loaded");

// Basic placeholder structure (safe starter)
let currentCard = {
  front: "λόγος",
  back: "word / reason / message"
};

let showingFront = true;

document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("card");

  if (!card) {
    console.warn("No #card element found in HTML");
    return;
  }

  card.textContent = currentCard.front;

  card.addEventListener("click", () => {
    showingFront = !showingFront;
    card.textContent = showingFront ? currentCard.front : currentCard.back;
  });
});

// Install: cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// Fetch: offline-first strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // optional: fallback behavior when offline
        return caches.match("./index.html");
      });
    })
  );
});