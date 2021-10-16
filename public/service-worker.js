const FILES_TO_CACHE = [
	'/',
	'/index.html',
	'/index.js',
	'/styles.css'
]

const PRECACHE = "precache-v1"
const RUNTIME = "runtime"

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches
			.open(PRECACHE)
			.then(cache => cache.addAll(FILES_TO_CACHE))
			.then(self.skipWaiting())
	)
})

//take care of old caches
self.addEventListener('activate', (event) => {
	const currentCaches = [PRECACHE, RUNTIME]
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
			})
			.then((cachestoDelete) => {
				return Promise.all(
					cachesToDelete.map((cacheToDelete) => {
						return caches.delete(cacheToDelete)
					})
				)
			})
			.then(() => self.clients.claim())
	)
})