mui.init();
mui.plusReady(function() {
	
	
	//业务员
	combGetCustomerType('addry',document.getElementById('ywyType'));
		//客户类型（默认）
	combGetCustomerType('url',document.getElementById('khlxType'));
	//楼盘
	combGetComboxType('city',document.getElementById('lpType'));	
	//户型
	combGetComboxType(9,document.getElementById('hxType'));	
	
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
	 
			var selectywy=document.getElementById("ywyType");  
			var ywy=selectywy.options[selectywy.selectedIndex].value;//设计师
			var ywyTitle=selectywy.options[selectywy.selectedIndex].text;//设计师
			var selectkhlx=document.getElementById("khlxType"); 
			var khlx=selectkhlx.options[selectkhlx.selectedIndex].value;//客户类型
 	 		var khlxTitle=selectkhlx.options[selectkhlx.selectedIndex].text;//客户类型
 	 		var selectlp=document.getElementById("lpType"); 
			var lp=selectlp.options[selectlp.selectedIndex].value;//楼盘
 	 		var lpTitle=selectlp.options[selectlp.selectedIndex].text;//楼盘
 	 		var selecthx=document.getElementById("hxType"); 
			var hx=selecthx.options[selecthx.selectedIndex].value;//户型
 	 		var hxTitle=selecthx.options[selecthx.selectedIndex].text;//户型 
 	 		
 	 		   var lhTitle=document.getElementById("lhTitle").value; //楼号
 	 		    var adressTitle=document.getElementById("adressTitle").value; //单元/房号
 	 		 var bzContent=document.getElementById("bzContent").value; //备注
			datastr=khmc+';'+tel+';'+lhTitle+';'+adressTitle+';'+khlx+';'+khlxTitle+';'+ywy+';'+ywyTitle+';'+lp+';'+lpTitle+';'+hx+';'+hxTitle+';'+bzContent+';'+getUserInfo().ID;
		var data = {
			 data:datastr
		};
		common.Verifauthority(r_add_custmoer, function(result) { 
				 	if(!result)
						return;
		});
		commitLock = false;
		//common.showWaiting();
	   //alert(JSON.stringify(data))
		common.postApi("AddCustomer", data, function(response) {
			 //alert(JSON.stringify(response.data))
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
    //获取COMBOX第一种
     function combGetCustomerType(type,dgid)
     {
     	 common.postApi("GetCustomerType", {
			'url': type
		}, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				dgid.options.add(new Option(obj.CustomerType, obj.cid));
			}
		 
			common.closeWaiting();
		}, 'json');
     	
     }
     //获取COMBOX第二种
         function combGetComboxType(type,dgid)
     {
     	 common.postApi("GetComboxType", {
			'parentid': type
		}, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				dgid.options.add(new Option(obj.params_name, obj.id));
			}
	 
			common.closeWaiting();
		}, 'json');
     	
     }
 
 
 common.backOfHideCurrentWebview();
});