let path = '/pwa-basic'; 
let CACHE_NAME = 'my-site-cache-v1'; 
let urlsToCache = [
	`${path}`, 
	`${path}/fallback.json`, 
	`${path}/css/main.css`,
	`${path}/js/jquery.min.js`,
	`${path}/js/main.js`,
	`${path}/images/logo.png`
];

// memulai install serviceworker
self.addEventListener("install", event => {

	//Perform install steps 	
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			console.log("cache serviceworker dimulai");
			return cache.addAll(urlsToCache);  
		})
	);

});


// callbacknya akses lagi URL nya
self.addEventListener("fetch", event => {
	// event.respondWith(
	// 	caches.match(event.request).then(function(response){
	// 		// console.log(event.request); 
	// 		//cache hit - return response
	// 		if (response) {
	// 			return response
	// 		}
	// 		return fetch(event.request); 
	// 	})
	// )

	/////////////////////////////////////////////////////////////////////
	// tes strategi cache then network
	let request = event.request 
	let url 		= new URL(request.url); 

	//pisahkan request API dan Internal (css, js, img);
	if (url.origin === location.origin) {
		// jika datanya statis
		event.respondWith(
			caches.match(request).then(function(response){
				return response || fetch(request)
			})
		);
	}	else {
		// jika datanya dari API / dinamis
		// akan selalu akses network yg baru cache 
		// kalo ada atau punya data baru mesti di update di main js dulu, UI nya pun mau terupdate 
		event.respondWith(
			//nyimpen di cache baru
			caches.open('products-cache').then(function(cache){
				// fetch url ke network
				return fetch(request).then(function(liveResponse){
					cache.put(request, liveResponse.clone())
					return liveResponse
				}).catch(function(){
					return caches.match(request).then(function(response){
						if(response) return response // kalo berhasil ada di cache return di responnya
						return caches.match(`${path}/fallback.json`) // kalo tidak ada / tidak berhasil 
					})
				})
			})
		);
	}

});


// terfire ketika halaman di close, cocok ada serviceworker baru dan menghapus yang lama
// udah dicache tapi belum dipake
self.addEventListener("activate", event => {
	// let cacheWhiteList = ['pages-cache-v1', 'blog-post-cache-v1'];

	event.waitUntil(
		caches.keys().then(function(cacheName){
			return Promise.all(
				cacheName.filter(function(cacheName) {
					return cacheName != CACHE_NAME 
				}).map(function(cacheName) {
					return caches.delete(cacheName); 
				})

				// cacheName.map(function(cacheName) {
				// 	if(cacheWhiteList.indexOf(cacheName) === -1) {
				// 		return caches.delete(cacheName); 
				// 	}
				// })
			);			
		})
	);	
});

// // This code executes in its own worker or thread
// self.addEventListener("install", event => {
// 	console.log("Service worker installed");
// });
// self.addEventListener("activate", event => {
// 	console.log("Service worker activated");
// });