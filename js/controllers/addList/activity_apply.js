mui.init();
mui.plusReady(function() {
	//设计师
 common.postApi("GetCustomerType", {
			'url': 'sjs'
		}, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				document.getElementById('sjsType').options.add(new Option(obj.CustomerType, obj.cid));
			}
			islocksjs=true;
			common.closeWaiting();
		}, 'json');
		//客户类型（默认）
		 common.postApi("GetCustomerType", {
			'url': 'url'
		}, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				document.getElementById('khlxType').options.add(new Option(obj.CustomerType, obj.cid));
			}
			islocksjs=true;
			common.closeWaiting();
		}, 'json');
	var commitLock = true;
	common.click("btnSubmit", function() {
		if (!commitLock) {
			return;
		}
		 var	datastr=""; 
		var khmc = common.textValiAlert(document.getElementById("khmcTitle").value, "请填写客户名称");
		if (!khmc) {
			return;
		}
		var tel = common.numValiAlert(document.getElementById("telTitle").value, "请填写客户电话");
		if (!tel) {
			return;
		}
	var address = common.textValiAlert(document.getElementById("adressTitle").value, "请填写地址");
		if (!address) {
			return;
		}
			var selectsjs=document.getElementById("sjsType");  
			var sjs=selectsjs.options[selectsjs.selectedIndex].value;//设计师
			var sjsTitle=selectsjs.options[selectsjs.selectedIndex].text;//设计师
			var selectkhlx=document.getElementById("khlxType"); 
			var khlx=selectsjs.options[selectkhlx.selectedIndex].value;//客户类型
 	 		var khlxTitle=selectsjs.options[selectkhlx.selectedIndex].text;//客户类型
 	 		 var xq=document.getElementById("xqTitle").value; //小区
 	 		 var hx=document.getElementById("hxTitle").value; //户型
 	 		 var bzContent=document.getElementById("bzContent").value; //户型
			datastr=khmc+';'+address+';'+tel+';'+khlx+';'+khlxTitle+';'+xq+';'+hx+';'+sjs+';'+sjsTitle+';'+bzContent+';'+getUserInfo().UserName;
		var data = {
			 data:datastr
		};
		common.Verifauthority(r_add_custmoer, function(result) { //企业新闻发送
				 	if(!result)
						return;
		});
		commitLock = false;
		//common.showWaiting();
//		alert(JSON.stringify(data))
		common.postApi("AddCustomer", data, function(response) {
			// alert(JSON.stringify(response.data))
			if (response.data == "success") {
				mui.toast("提交成功，自动跳转到列表界面..");
				go();
			} else {
				mui.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	});
	mui.back = function() {
				currentWebViewHide();
			}
	function go() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {
					id: ''
				});
				mui.back();
	}
 
 common.backOfHideCurrentWebview();
});