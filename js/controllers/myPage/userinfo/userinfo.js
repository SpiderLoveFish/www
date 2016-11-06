var Avatar = document.getElementById("Avatar");
mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	mui.previewImage();
	getuser();
	document.getElementById("updateImg").addEventListener('tap', function() {
		galleryImg();
	});
	//	common.click('updateImg', function() {
	//		
	//	});
	//-----------------------------------图片上传开始----------------------------------------------------
	var f1 = null;

	function galleryImg() {
		// 从相册中选择图片
		plus.gallery.pick(function(path) {
			common.showWaiting('正在上传');

			GetBase64(path);
		}, function(e) {

		}, {
			filter: "image"
		});
	}

	function GetBase64(url) {
		// 兼容以“file:”开头的情况
		if (0 != url.toString().indexOf("file://")) {
			url = "file://" + url;
		}
		var _img_ = new Image();
		_img_.src = url; // 传过来的图片路径在这里用。
		_img_.onload = function() {
			var tmph = _img_.height;
			var tmpw = _img_.width;
			var isHengTu = tmpw > tmph;
			var max = Math.max(tmpw, tmph);
			var min = Math.min(tmpw, tmph);
			var bili = min / max;
			if (max > 800) {
				max = 800;
				min = Math.floor(bili * max);
			}
			tmph = isHengTu ? min : max;
			tmpw = isHengTu ? max : min;
			_img_.style.border = "1px solid rgb(200,199,204)";
			_img_.style.margin = "10px";
			_img_.style.width = "150px";
			_img_.style.height = "150px";
			_img_.onload = null;
 
			plus.io.resolveLocalFileSystemURL(url, function(entry) {
					entry.file(function(file) {
						canvasResize(file, {
							width: tmpw,
							height: tmph,
							crop: false,
							quality: 50, //压缩质量
							rotate: 0,
							format: 'jpg',
							callback: function(data, width, height) {						
								f1 = data;
								upload();
							}
						});
					});
				},
				function(e) {
					common.closeWaiting();
				});
		};
	};
	
	function upload(path) {
		var task = plus.uploader.createUpload(UploadImageUrl+'?Action=uploadhead', {
				method: "POST",
				blocksize: 204800,
				priority: 1000
			},
			function(t, status) {
				if (status == 200) {
					if (success) success(t);
				} else {
					if (fail) fail(status);
				}
			}
		);
		
		task.addFile(path, {
			key: 'file'
		});
		//alert(f1) 
		task.addData('base64', f1);
		task.start();
	}
	//成功响应的回调函数
	var success = function(response) {
		//alert(JSON.stringify(response))
			var array = response.responseText.split('|');
			if (array[0] == '0') {
				uploadimg(array[1]);
			}
	} 
		//------------------------------图片上传结束---------------------------------------------
});

function uploadimg(imgurl) {
	var data = {
		imgurl: imgurl,
		token:getUserInfo().token
	};
	common.postApi('UpdateUserAvatar', data, function(response) {
	//	alert(JSON.stringify(ApiUrl+'images/upload/portrait/'+ imgurl))
		if (response.data == "success") {
			common.closeWaiting();
			Avatar.src = ApiUrl+'images/upload/portrait/'+ imgurl;
			common.initMine();
			common.initAddList();
			common.alert('修改成功');
		}else if(response.data =="faile")common.alert('修改失败');
	}, 'json');
}

function getuser() {
	//common.showWaiting(true);
	var user = getUserInfo();
// 	alert(JSON.stringify(user))
	var data = {
		url: ApiUrl,
		token: user.UserId
	};

	var username = document.getElementById("username");
	var mobile = document.getElementById("mobile");
	var DepartmentName = document.getElementById("DepartmentName");
	var Position = document.getElementById("Position");
	var Email = document.getElementById("Email");
	var Address = document.getElementById("Address");
		var jf = document.getElementById("jf");
	common.postApi('GetUserClientId', data, function(response) {

		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			Avatar.src = obj.Avatar;
			username.innerText = obj.name;
			mobile.innerText = obj.tel;
			DepartmentName.innerText = obj.dname;
			Position.innerText = obj.zhiwu;
			Email.innerText = obj.email;
			Address.innerText = obj.Address;
			jf.innerText = obj.jf; 
		}
		common.closeWaiting();
	}, 'json');
	
	
	var detailPage = null;
	document.getElementById("lijf").addEventListener('tap', function() {
		var id = getUserInfo().ID;
		var score= jf.innerText;
		//var template = common.getTemplate('page2', 'activity_detail.html?id=' + id+'&sfkh=NY&score='+score);
			if(!detailPage) {
			detailPage.setStyle({
				left: '100%',
				zindex: 9999
			});
		}
	detailPage.loadURL('activity_detail.html?id=' + id+'&sfkh=NY&score='+score);
		openMenu();
	});
	var detailPageId = 'activity_detail.html';
	var mask = mui.createMask(_closeMenu);
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		detailPage = common.getWebviewDetailById(detailPageId);
	}, 150);
	//监听详情页面请求关闭
	window.addEventListener('hideDetailPage', function() {
		_closeMenu();
		mask.close();
	});
	/*
	 * 显示菜单菜单
	 */
	function openMenu() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		setTimeout(function() {
			detailPage.show('none', 0, function() {
				detailPage.setStyle({
					left: '15%',
					transition: {
						duration: 150
					}
				});
			});
			mask.show(); //遮罩
		}, 350);
	}
	/**
	 * 关闭侧滑菜单(业务部分)
	 */

	function _closeMenu() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}
		//主窗体开始侧滑；
		detailPage.setStyle({
			left: '100%',
			transition: {
				duration: 150
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			detailPage.hide();
		}, 300);
	}
	/********部门侧滑end*****************************************/

}