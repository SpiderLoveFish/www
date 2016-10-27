var currview;

mui.plusReady(function() {
	currview = plus.webview.currentWebview();
	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};

	mui.previewImage(); 
	 
	var data = {
			tel: '',
			type: 'XGT3D',
			cid: common.getQueryString("desid"),
			uid: getUserInfo().ID
		};
		//alert(JSON.stringify(data))
		//document.getElementById("UserList").innerHTML = '';
		document.getElementById("AContext").innerHTML = '';
		common.postApi('GetQJT', data, function(response) {
			
			var dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
//				document.getElementById("ReleaseDateTime").innerText = DateFormat(getDateTimeStamp(obj.ReleaseTime.substring(0, 19)), 'yyyy-MM-dd 星期W HH:mm');
//				//document.getElementById("Start_end_Time").innerText = obj.StartTime + '~' + obj.EndTime;
//				document.getElementById("ReleaseName").innerText = getUserInfo().UserName;
//				document.getElementById("ATheme").innerText = obj.Title;
//				conText = obj.news_content;
						document.getElementById("AContext").innerHTML += '<img src="' + obj.img + '" data-preview-src="" data-preview-group="1"/>';
			 
			}

			
			//document.getElementById("AContext").innerHTML += obj.IMG;
			//		 	//document.getElementById("userCount").innerText = '活动已报名(' + dataArray[1].length + '人)';
			common.closeWaiting();
			 
		}, 'json');
	});
	function showMsg() {
		var data = {
			tel: '',
			type: 'XGT3D',
			cid: desid,
			uid: getUserInfo().ID
		};
		alert(JSON.stringify(data))
		//document.getElementById("UserList").innerHTML = '';
		document.getElementById("AContext").innerHTML = '';
		common.postApi('GetQJT', data, function(response) {
			
			var dataArray = eval(response.data);
			alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
//				document.getElementById("ReleaseDateTime").innerText = DateFormat(getDateTimeStamp(obj.ReleaseTime.substring(0, 19)), 'yyyy-MM-dd 星期W HH:mm');
//				//document.getElementById("Start_end_Time").innerText = obj.StartTime + '~' + obj.EndTime;
//				document.getElementById("ReleaseName").innerText = getUserInfo().UserName;
//				document.getElementById("ATheme").innerText = obj.Title;
//				conText = obj.news_content;
						document.getElementById("AContext").innerHTML += '<img src="' + obj.img + '" data-preview-src="" data-preview-group="1"/>';
			 
			}

			
			//document.getElementById("AContext").innerHTML += obj.IMG;
			//		 	//document.getElementById("userCount").innerText = '活动已报名(' + dataArray[1].length + '人)';
			common.closeWaiting();
			 
		}, 'json');
	}
