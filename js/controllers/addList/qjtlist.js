var list = document.getElementById("list");
 //"javascript:;"
var html_CanYu = '<a href=@url  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
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
	 //alert(JSON.stringify(data))
	common.postApi('GetQJT', data, function(response) {
		dataArray = eval(response.data);
		// alert(JSON.stringify(response))
			for (var i = 0; i < dataArray[0].length; i++) {
			var obj = dataArray[0][i];
			list.innerHTML += html_CanYu.replace('@ID', obj.id).replace('@STheme', obj.DyGraphicsName).replace('@SContext', obj.Remarks).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime)).replace('@flag', obj.lx).replace('@url', obj.DyUrl); 
		
		}
		for (var i = 0; i < dataArray[1].length; i++) {
			var obj = dataArray[1][i];
		list.innerHTML += html_CanYu.replace('@ID', obj.key).replace('@STheme', obj.title).replace('@SContext', obj.title).replace('@ReleaseTime', ChangeDateFormat(obj.addtime)).replace('@flag', '酷家乐').replace('@url', obj.link);
			}
	 
 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
 
	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var href = this.getAttribute('href');
		 mui.openWindow({
			    url:'show.html',
			    id:'show.html',
			    extras:{
			        ID:href
			    }
			});
	//var webview = common.getTemplate('show',"show.html?a="+href);
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