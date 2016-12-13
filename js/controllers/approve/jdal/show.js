
mui.plusReady(function() {
	mui.previewImage();	 
	document.getElementById("AContext").innerHTML = '';	 	
	var ws=plus.webview.currentWebview();
	var img = ws.ID;
			document.getElementById("AContext").innerHTML += '<img src="' + img + '" data-preview-src="" data-preview-group="1"/>';
 
});