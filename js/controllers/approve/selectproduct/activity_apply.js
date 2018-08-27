

	 
mui.plusReady(function() {
	var id= common.getQueryString("id"); 
var cid= common.getQueryString("cid"); 
var tag=common.getQueryString("tag"); 
var status=0;
	var btnSubmit1=document.getElementById("btnSubmit1");
   if(tag==0){  	btnSubmit1.innerHTML="提交";status=1;}
   if(tag==1){
   	btnSubmit1.innerHTML="退回";status=0;
   }
// if(tag==7){
// 	btnSubmit1.style.display="none";//隐藏
// }
   common.click("btnSubmit1", function() {
   	var data1={
   		status:status,
   		cid:cid,
   		id:id
   	};
   	common.postApi("UpdatePurchaseListStatus", data1, function(response) {
			// alert(JSON.stringify(response.data))
			if (response.data == "success") {
				mui.toast("提交成功!!!");
				Back();
				mui.back();
			} else {
				mui.toast("服务器异常，请稍候重试..");
			}
			//commitLock = true;
			//common.closeWaiting();
		}, 'json');
	
});
   	
common.click("btnSubmit", function() {
	var bz=document.getElementById("bz").value;
   	var sqsl=document.getElementById("sqsl").value;
   
	var data1={
		 sum:sqsl,
		 remarks:bz,
		 cid:cid,
		 id:id
	};
		 //alert(JSON.stringify(data1));
		common.postApi("UpdatePurchaseListSum", data1, function(response) {
			// alert(JSON.stringify(response.data))
			if (response.data == "success") {
				mui.toast("提交成功!!!");
				Back();
				mui.back();
			} else {
				mui.toast("服务器异常，请稍候重试..");
			}
			//commitLock = true;
			//common.closeWaiting();
		}, 'json');
	
});
	 		function Back() {
					var webViewC = plus.webview.currentWebview().opener(); //父页面
					//transData 是C页面自定义事件的名称
					mui.fire(webViewC, 'transData1', {
//						tableview: checkedValues
					});
				}
	 
	//id = common.getQueryString("id");
//	document.getElementById("sendMessage").addEventListener('tap', function() {
//		currentWebViewHide();
//		var template = common.getTemplate('page2', 'addfollow.html?id=' + id);
//	});
//	document.getElementById("btn_post_activ").addEventListener('tap', function() {
//		currentWebViewHide();
//		var template = common.getTemplate('page2', 'im_chat.html?id=' + id);
//	});
	//window.addEventListener('dataInit', function(event) {
	//获取从父页面传过来的数据
	//id = event.detail.id;
	//common.showWaiting(true);
	var data = {
		cid:cid,
		strwhere:'',
		id:id,
		uid: getUserInfo().ID 
	};
	
 //alert(JSON.stringify(data))
	
	common.postApi('GetPurchaseList', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(dataArray))
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
 	 
			document.getElementById("product_name").innerText = obj.product_name;
			document.getElementById("specifications").innerText = obj.specifications;
			document.getElementById("category_name").innerText = obj.category_name;
			document.getElementById("Brand").innerText = obj.Brand;
			document.getElementById("jg").innerText = "￥"+obj.InternalPrice;
			document.getElementById("unit").innerText = obj.unit;
			document.getElementById("sqsl").value = obj.AmountSum;
			document.getElementById("wcsl").innerText = obj.wcsl;
			document.getElementById("ztsl").innerText = obj.ztsl;  
			document.getElementById("bz").value = obj.b1;  
			var btnSubmit=document.getElementById("btnSubmit");
				   var btnSubmit1=document.getElementById("btnSubmit1");
				 console.log(tag);
				 if(tag==0){  
				 	btnSubmit1.innerHTML="提交";status=1;
				 
				 }
				  else if(tag==1&&obj.AmountSum<(obj.wcsl+obj.ztsl))
				  {
				  	 btnSubmit.style.display="none";//隐藏
				   	btnSubmit1.innerHTML="退回";status=0;
				   }
				  // alert(obj.AmountSum>(obj.wcsl+obj.ztsl))
				 else  if(tag==7&&obj.AmountSum>(obj.wcsl+obj.ztsl)){
				   btnSubmit1.innerHTML="再次提交";status=1;
				 
				   }
				   else{
				   	btnSubmit1.style.display="none";//隐藏
				   }
			//userName = obj.Customer;
			//Avatar = obj.Avatar;
		}
		common.closeWaiting();
	}, 'json');

	//}); 
	//	var sendmsg = document.getElementById("sendmsg");
	//	sendmsg.addEventListener("tap", function() {
	//		common.toast("此功能正在研发,敬请等待..");
	//	});
	mui.back = function() {
		
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	}
//
//	function currentWebViewHide() {
//		var fatherView = plus.webview.currentWebview().opener(); //父页面
//		//closeMenu 是C页面自定义事件的名称
//		mui.fire(fatherView, 'hideDetailPage', {
//			//					id: id
//		});
//	}
});