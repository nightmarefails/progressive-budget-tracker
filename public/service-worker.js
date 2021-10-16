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

// manage fetch requests
self.addEventListener("fetch", event => {
	if (event.request.url.includes('/api')) {
		event.respondWith(
			caches.open(DATA_CACHE_NAME).then(cache => {
				return fetch(event.request)
					.then(response => {
						// If the response was ok, clone it and store in the cache.
						if (response.status === 200) {
							cache.put(event.request.url, response.clone())
						}

						return response
					})
					.catch(error => {
						// Network request failed, try to get it from the cache.
						return cache.match(event.request)
					})
			}).catch(err => console.log(err))
		);
		return
	}

	event.respondWith(
		caches.open(PRECACHE).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request)
			})
		})
	)

})