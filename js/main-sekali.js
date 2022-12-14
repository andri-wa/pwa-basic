$(document).ready(function(){
	let _url = "https://my-json-server.typicode.com/andri-wa/pwaapi/products"

	let dataResult = ""; 
	let catResult= ""; 
	let categories = []; 

	$.get(_url, function(data) {
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
	});	

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
		navigator.serviceWorker.register("/serviceworker.js").then(function(registration) {
			// Registration was successful
			console.log('Serviceworker berhasil dengan scope', registration.scope); 
		}, function(err){
			console.log('Serviceworker Gagal', err); 
		});		
	});
}