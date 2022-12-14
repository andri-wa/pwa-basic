// kalo ada product terbaru dari API 


$(document).ready(function(){
	let _url = "https://my-json-server.typicode.com/andri-wa/pwaapi/products"

	let dataResult = ""; 
	let catResult= ""; 
	let categories = []; 
	
	//fungsi untuk jika ada data terbaru dari API
	function renderPage(data) {		
		$.each(data, function(key, items){

			let _cat = items.category; 

			dataResult += `
				<div>
					<h3>${items.name}</h3>
					<p>${_cat}</p>
				</div>
			`;

			if($.inArray(_cat, categories) == -1) {
				categories.push(_cat);
				catResult += `
					<option value="${_cat}">${_cat}</option>
				`;  
			};

		});
		$("#products").html(dataResult); 
		$("#cat_select").html("<option value='all'>semua</option>" + catResult); 		
	} 

	// get datanya/ ajaxnya pake  fetch
	// fresh data dari online
	let networkDataReceived = false
	let networkUpdate = fetch(_url).then(function(response) {
		return response.json(); 
	}).then(function(data){
		networkDataReceived = true;
		renderPage(data); 
	}) // fetch dari url awal


	// return data dari cache
	caches.match(_url).then(function(response) {
		if (!response) throw Error('tida ada data di cahce')
		return response.json() 
	}).then(function(data){
		if(!networkDataReceived) {
			renderPage(date)
			console.log('render data dari cache')
		}
	}).catch(function(){
		return networkUpdate
	})	


	// get data dari API
	// $.get(_url, function(data) {
	// 	$.each(data, function(key, items){

	// 		let _cat = items.category; 

	// 		dataResult += `
	// 			<div>
	// 				<h3>${items.name}</h3>
	// 				<p>${_cat}</p>
	// 			</div>
	// 		`;

	// 		if($.inArray(_cat, categories) == -1) {
	// 			categories.push(_cat);
	// 			catResult += `
	// 				<option value="${_cat}">${_cat}</option>
	// 			`;  
	// 		};

	// 	});
	// 	$("#products").html(dataResult); 
	// 	$("#cat_select").html("<option value='all'>semua</option>" + catResult); 
	// });	

	//fungsi filter 
	$("#cat_select").on('change', function(){
		updateProduct($(this).val()); 
	});
	function updateProduct(cat) {

		let dataResult = "";  
		let _newUrl = _url; 
			if(cat != 'all') 
			// _newUrl = _url + "?category=" + cat; 
			_newUrl = `${_url}?category=${cat}`; 
			
		$.get(_newUrl, function(data) {

			$.each(data, function(key, items){
	
				let _cat = items.category; 
	
				dataResult += `
					<div>
						<h3>${items.name}</h3>
						<p>${_cat}</p>
					</div>
				`;				
	
			});
			$("#products").html(dataResult); 
		});	
	}

});


//PWA 
// Register Serviceworker
if ('serviceWorker' in navigator) {
	// navigator.serviceWorker.register("/serviceworker.js");
	window.addEventListener('load', function() {
		navigator.serviceWorker.register("/pwa-basic/serviceworker.js").then(function(registration) {
			// Registration was successful
			console.log('Serviceworker berhasil dengan scope', registration.scope); 
		}, function(err){
			console.log('Serviceworker Gagal', err); 
		});		
	});
}