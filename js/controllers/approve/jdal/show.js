var ws=null,embed=null;var strurl=null;
mui.plusReady(function() {
//	ws=plus.webview.currentWebview();
//	var fdStart = ws.ID.indexOf("http://");
//		if(fdStart == 0){
//		   strurl=ws.ID;
//			ws.addEventListener('show',createEmbed,false);
//		}else if(fdStart == -1){
//		  strurl='http://www.baidu.com/';
//		  ws.addEventListener('show',createEmbed,false);
//		}
//		
	
	mui.previewImage();	 
	document.getElementById("AContext").innerHTML = '';	 	
	var ws=plus.webview.currentWebview();
	var img = ws.ID;
			document.getElementById("AContext").innerHTML += '<img src="' + img + '" data-preview-src="" data-preview-group="1"/>';
 
});

function openBrowser() {
	ws=plus.webview.currentWebview();
	var url = ws.url;
	//console.log(JSON.stringify(ws))
	plus.runtime.openURL( url );
}

// 创建子Webview
function createEmbed(){
	var topoffset='45px';
	if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
		topoffset=(Math.round(plus.navigator.getStatusbarHeight())+45)+'px';
	}
	plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
//	 mui.openWindow(strurl,'embed',{})
	embed=plus.webview.create(strurl,'embed',{top:topoffset,bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
	ws.append(embed);
	embed.addEventListener('loaded',function(){
		plus.nativeUI.closeWaiting();
	},false);
	embed.addEventListener('loading',function(){
		plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
	},false);
}
