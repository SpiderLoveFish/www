mui.init();
var list = document.getElementById("list");
var starIndex = 10;
var endIndex = 1000;
var selecttype = 'dqr';
var id = common.getQueryString("id");
var type= common.getQueryString("selecttype");
var commitLock = true; 
var status = 0;
var html_CanYu =
	//'	<li class="mui-table-view-cell">'+
	//				'<div class="mui-slider-right mui-disabled">'+
	//					'	<a class="mui-btn mui-btn-red">删除</a>'+
	//				'	</div>'+
	//				'<div class="mui-slider-handle mui-table">'+
	'<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID" tag="@tag">' +
	//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
	'			<p class="label_describe_2">@SContext</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
	'		<div class="sc_cell_data">' +
	'			<p>@flag</p>' +
	'		</div>' +
	'	</a>';
mui.plusReady(function() {
	//后退键隐藏层
	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {type: type});
		common.currentWebviewHide();
	};
 
	var data = {
		pid: id,
		strWhere: ''
	};
	//alert(starIndex)
	common.postApi('GetPurchaseDetail', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		for(var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (obj.DoPerson == getUserInfo().ID) {
			list.innerHTML += html_CanYu.replace('@ID', obj.Purid).replace('@tag', obj.Customer_id).replace('@STheme', obj.material_name).replace('@SContext', obj.material_name).replace('@ReleaseTime', obj.unit).replace('@flag', obj.pursum);
			//			} else {
			//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.id).replace('@STheme', obj.BudgetName).replace('@SContext', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime));
			//			}
		}
		 
		//mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
		 
	}, 'json');
 

	 	var btnState = document.getElementById("btnState");
	//审批通过
	btnState.addEventListener("tap", function(e) {
		//	alert(1)
		var type = common.getQueryString("selecttype");
		if(type == "cgdsh") status = 2;
		else if(type == "cgdqr") status = 3;

		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.confirm('确认操作该条记录？', '同意', btnArray, function(e) {
			if(e.index == 0) {
				approve(status);
			}
		});

	});
var btnNopass = document.getElementById("btnNopass");
	//审批不通过
	btnNopass.addEventListener("tap", function(e) {
		var type = common.getQueryString("selecttype");
		if(type == "cgdsh") status = 0;
		else if(type == "cgdqr") status = 1;
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.confirm('确认退回条记录？', '不同意', btnArray, function(e) {
			if(e.index == 0) {
				approve(status);
			}
		});
	});

	//审批
	function approve(zt) {
		if(!commitLock) {
			return;
		}
			var data = {
			status: zt,
			pid: id
		};
		commitLock = false;
		//common.showWaiting(); 
		//alert(JSON.stringify(data))
		common.postApi('UpdatePurchaseStatus', data, function(response) {
			if(response.data == "success") {
				common.toast("提交成功");
				mui.back();
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}

	
 

});