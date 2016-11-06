mui.init({
	//	gestureConfig: {
	//		tap: true, //默认为true
	//		longtap: true //长按事件 默认为false
	//	}
});
var isCollect = '0';
var	 tel="";
	// 1收藏，0没收藏
mui.plusReady(function() {
	mui.previewImage();
	//	mui('.mine_container_body').on('longtap', '.flexItem', function() {
	//		alert(this.innerText);
	//	});
	id = common.getQueryString("id");
//	document.getElementById("sendMessage").addEventListener('tap', function() {
//		currentWebViewHide();
//		var template = common.getTemplate('page2', 'addfollow.html?id=' + id);
//	});
	document.getElementById("collect_star").addEventListener('tap', function() {
		var ustyle='';
		 
		if(isCollect=='0')
		ustyle='Insert';
		else if(isCollect=='1')
		ustyle='Delete';
		var data= {
		customerid: id,
		userid:getUserInfo().ID,
		UStyle:ustyle
	};
	//alert(JSON.stringify(data))
		if(isCollect=='1')
		{
			common.showWaiting(true);
			common.postApi('UpdateCustomerFavorite', data, function(response) {			
				if(response.data=="success")
				{
				isCollect='0';
					document.getElementById("collect_star").style.color="#D3D3D3";//灰色
					common.toast('取消客户收藏成功！')
				}				
			common.closeWaiting();
		}, 'json');
		
		}
		else if(isCollect=='0')
		{
			 
			common.showWaiting(true);
			common.postApi('UpdateCustomerFavorite', data, function(response) {	 
				if(response.data=="success")
				{
				isCollect='1';
				document.getElementById("collect_star").style.color="#008B45";//绿色
				common.toast('客户收藏成功！')
				}
				
			common.closeWaiting();
		}, 'json');
		}
	});
	//预算信息
	document.getElementById("ysxx").addEventListener('tap', function() {
		currentWebViewHide();
		var template = common.getTemplate('page2', '../approve/projecthour/yslist.html?id=' + id);
	});
	//效果图
		document.getElementById("xgt").addEventListener('tap', function() {
 	 
		currentWebViewHide();
		var template = common.getTemplate('xgtlist', 'xgtlist.html?type=XGT&tel=' + tel+'&cid='+id);
	});
	//全景tu
		document.getElementById("qjt").addEventListener('tap', function() {
		currentWebViewHide();	 
		var template = common.getTemplate('qjtlist', 'qjtlist.html?type=QJT&tel=' + tel+'&cid='+id);
	});
	//window.addEventListener('dataInit', function(event) {
	//获取从父页面传过来的数据
	//id = event.detail.id;

	common.showWaiting(true);
	var data = {
		id: id ,
		userid:getUserInfo().ID
	};
	common.postApi('GetCustomerDetail', data, function(response) {
		dataArray = eval(response.data);
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
//			document.getElementById("Avatar").src = obj.Avatar;
//			document.getElementById("UserName").innerText = obj.UserName;
//			document.getElementById("mobeil").innerText = obj.Mobile;
			isCollect=obj.isstart;
			if(isCollect=='1')//是否收藏 #FF00FF 紫红色
			document.getElementById("collect_star").style.color="#008B45";//绿色
	 		else	 
	 		document.getElementById("collect_star").style.color="#D3D3D3";//灰色
	
			document.getElementById("Customer").innerText = obj.Customer;
			document.getElementById("address").innerText = obj.address;
			document.getElementById("tel").innerText = obj.tel;
			tel=obj.tel;
			document.getElementById("CustomerType").innerText = obj.CustomerType;
			//document.getElementById("Remarks").innerText = obj.Remarks == null ? "备注：" : "备注：" + obj.Remarks;
			document.getElementById("Createname").innerText = obj.Create_name+'('+obj.cd+')';
			document.getElementById("sjs").innerText = obj.sjs;
			document.getElementById("ywy").innerText = obj.ywy;
			document.getElementById("sgjl").innerText = obj.sgjl; 
			userName = obj.Customer;
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
		currentWebViewHide();
	}

	function currentWebViewHide() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {
			//					id: id
		});
	}
});