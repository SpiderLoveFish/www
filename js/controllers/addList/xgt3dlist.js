var currview;
var picId='';
var strurl = '';
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
			if(obj.picType == '1')
				{
				//strurl = panoLink;
				if( obj.picId!=undefined&& obj.picId!=''& obj.picId!=null& obj.picId!='null'& obj.picId!='undefined')
				picId = picId + ',' + obj.picId;
				}
		 
			//				document.getElementById("ReleaseDateTime").innerText = DateFormat(getDateTimeStamp(obj.ReleaseTime.substring(0, 19)), 'yyyy-MM-dd 星期W HH:mm');
			//				//document.getElementById("Start_end_Time").innerText = obj.StartTime + '~' + obj.EndTime;
			//				document.getElementById("ReleaseName").innerText = getUserInfo().UserName;
			//				document.getElementById("ATheme").innerText = obj.Title;
			//				conText = obj.news_content;
			document.getElementById("AContext").innerHTML += '<img src="' + obj.img + '" data-preview-src="" data-preview-group="1"/>';

		}
			if (picId.substr(0,1)==',') picId=picId.substr(1);
//alert(picId)
		//document.getElementById("AContext").innerHTML += obj.IMG;
		//		 	//document.getElementById("userCount").innerText = '活动已报名(' + dataArray[1].length + '人)';
		common.closeWaiting();

	}, 'json');
	
	document.getElementById("idmyt").addEventListener('tap', function() {
			var data = {
				tel: '',
				type: 'XGT3DALL',
				cid: picId,
				uid: getUserInfo().ID
			};
			if(strurl == '') {
				common.postApi('GetQJT', data, function(response) {

						var fdStart = response.data.indexOf("http://");
						if(fdStart == 0) {
							var href = response.data;
							mui.openWindow({
								url: 'show.html',
								id: 'show.html',
								extras: {
									ID: href
								}
							});
					} else if(fdStart == -1) {
						mui.alert('漫游图生成错误！' + response.data)
					}

				}, 'json');
		} else {

			mui.openWindow({
				url: 'show.html',
				id: 'show.html',
				extras: {
					ID: strurl
				}
			});

		}

	});

});