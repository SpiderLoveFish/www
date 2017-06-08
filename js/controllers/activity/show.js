
mui.plusReady(function() {
	mui.previewImage();	 
	document.getElementById("AContext").innerHTML = '';	 	
	var ws=plus.webview.currentWebview();
	var img = ws.ID;
			document.getElementById("AContext").innerHTML += '<img src="' + img + '" data-preview-src="" data-preview-group="1"/>';
 function getServerUrls(setName) {
					//获取快捷键
					var shortcuts = JSON.parse(localStorage.getItem(setName) || "[]");
					return shortcuts;
				}
common.click('btnshare', function() {
					var url=getServerUrls('$ServerUrls').ApiUrl+'view/score_view.aspx?sfkh'+common.getQueryString("sfkh")+'&id='+common.getQueryString("id");
					shareHref('积分详情',url ,'积分详情','积分详情','')
		});
});