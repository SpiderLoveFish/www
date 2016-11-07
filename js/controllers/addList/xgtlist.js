var list = document.getElementById("list");
 //"javascript:;"
var html_CanYu = '<a href=@url  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
	//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
	'			<p class="label_describe_2">@SContext</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
//	'		<div class="sc_cell_data">' +
////	'			<p>@flag</p>' +
//	'		</div>' +
	'	</a>';
$(function() {
	 
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 50);
		 
});

function getpullupRefresh() {
	setTimeout(function() {
		getquestionnairelist();
	}, 500);
}

function ChangeDateFormat(jsondate) {
	jsondate = jsondate.replace("/Date(", "").replace(")/", "");
	if(jsondate.indexOf("+") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("+"));
	} else if(jsondate.indexOf("-") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("-"));
	}

	var date = new Date(parseInt(jsondate, 10));
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

	return date.getFullYear() +
		"年" +
		month +
		"月" +
		currentDate +
		"日";
	//  + " "
	//  + date.getHours()
	//  + ":"
	//  + date.getMinutes();
}

 
function getquestionnairelist() {
	var data = {
			tel: common.getQueryString("tel"),
		type: common.getQueryString("type"),
		cid: common.getQueryString("cid"),
		uid:getUserInfo().ID
	};
	// alert(JSON.stringify(data))
	common.postApi('GetQJT', data, function(response) {
		dataArray = eval(response.data);
		// alert(JSON.stringify(response))
			for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			list.innerHTML += html_CanYu.replace('@ID', obj.desid).replace('@STheme', obj.DyGraphicsName).replace('@SContext', obj.Remarks).replace('@ReleaseTime', ChangeDateFormat(obj.dotime)); 
		
		}
	
 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
 
	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var href = this.getAttribute('id');
//		 mui.openWindow({
//			    url:'show3d.html',
//			    id:'show3d.html',
//			    extras:{
//			        desid:href
//			    }
//			});
			//alert(href)
	var webview = common.getTemplate('show',"show3d.html?desid="+href);
		//detailPage.loadURL(href);
	//	openMenu();
	});
	 

	if(plus.os.name != "Android") {
		var pullrefresh = document.getElementById("pullrefresh");
		pullrefresh.style.marginTop = CommonTop;
	}
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: getpullupRefresh
			}
		}
	});
	if(mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			}, 50);
		});
		 
	} else {
		mui.ready(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	 
	}
	window.addEventListener('refresh1', function() {
 
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		common.initMessage();
	});
});