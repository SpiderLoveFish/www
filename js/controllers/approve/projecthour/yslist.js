var list = document.getElementById("list");
var starIndex = 0;
var endIndex = 1000;
var selecttype = 'dqr';
var news_hint = document.getElementsByClassName("news_hint");
var html_No = '<a href="javascript:;" class="sc_cell sc_padding  mui-table-view-cell"  id="@ID">' +
//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>(<p>@djbh</p>)' +
	'			<p class="label_describe_2">@SContext</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
		'		<div class="sc_cell_data">' +
	'			<p>@flag</p>' +
	'		</div>' +
	'	</a>';
var html_CanYu = '<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>(<p>@djbh</p>)' +
	'			<p class="label_describe_2">@SContext</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
	'		<div class="sc_cell_data">' +
	'			<p>@flag</p>' +
	'		</div>' +
	'	</a>';
$(function() {
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {

				if (i == 0) {
					starIndex = 0;
					endIndex = 1000;
					if (selecttype != "dqr") {//待确认
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'dqr';
				} else {
					starIndex = 0;
					endIndex = 10;
					if (selecttype != "yqr") {//已确认
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'yqr';
				}
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 50);
			});
		})
	});

	news_hint[0].style.display = "none";
});

function getpullupRefresh() {
	setTimeout(function() {
		getquestionnairelist();
	}, 500);
}
function ChangeDateFormat(jsondate) {
  jsondate = jsondate.replace("/Date(", "").replace(")/", "");
  if (jsondate.indexOf("+") > 0) {
    jsondate = jsondate.substring(0, jsondate.indexOf("+"));
  }
  else if (jsondate.indexOf("-") > 0) {
    jsondate = jsondate.substring(0, jsondate.indexOf("-"));
  }
 
  var date = new Date(parseInt(jsondate, 10));
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
 
  return date.getFullYear()
    + "年"
    + month
    + "月"
    + currentDate
    + "日";
//  + " "
//  + date.getHours()
//  + ":"
//  + date.getMinutes();
}
var search = document.getElementById("search");
function getquestionnairelist() {
	var data = {
		strWhere: search,
		lx:selecttype,
		uid: getUserInfo().ID
//		starIndex: starIndex,
//		endIndex: endIndex,
		//type: selecttype,
	};
	common.postApi('GetBudge', data, function(response) {
		dataArray = eval(response.data);
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (obj.DoPerson == getUserInfo().ID) {
				list.innerHTML += html_CanYu.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.id).replace('@STheme', obj.BudgetName).replace('@SContext', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime))
				.replace('@flag', obj.zt).replace('@djbh', obj.id);
//			} else {
//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.id).replace('@STheme', obj.BudgetName).replace('@SContext', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime));
//			}
		}
		starIndex = starIndex + 10;
		if (selecttype == "dqr") {
			mui('#pullrefresh').pullRefresh().refresh(true);
			if (dataArray.length > 0) {
				news_hint[0].style.display = "block";
				news_hint[0].innerText = dataArray.length;
			} else {
				news_hint[0].style.display = "none";
			}
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		} else {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
		}
	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var id = this.getAttribute('id');
		var webview = common.getTemplate('page1');
		webview.loadURL('ysdetail.html?id=' + id);
	});
	if (plus.os.name != "Android") {
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
	if (mui.os.plus) {
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
		if (selecttype == "dqr") {
			list.innerHTML = "";
			starIndex = 0;
			endIndex = 1000;
			getquestionnairelist();
		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		common.initMessage();
	});
});