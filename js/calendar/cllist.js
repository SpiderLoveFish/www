var list = document.getElementById("list");
var starIndex = 10;
var endIndex = 1000;
var selecttype = 'dqr';
var news_hint = document.getElementsByClassName("news_hint");
var html_No = '<a href="javascript:;" class="sc_cell sc_padding  mui-table-view-cell"  id="@ID">' +
	//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
	'			<p class="label_describe_2">@SContext@djbh</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
	'		<div class="sc_cell_data">' +
	'			<p>@flag</p>' +
	'		</div>' +
	'	</a>';
var html_CanYu = '<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
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
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {

				if(i == 0) {
					starIndex = 10;
					endIndex = 1000;
					if(selecttype != "dqr") { //待确认
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'dqr';
				} else {
					starIndex = 10;
					endIndex = 10;
					if(selecttype != "yqr") { //已确认
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

	//news_hint[0].style.display = "none";
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

document.getElementById('search').addEventListener('input', function() {
	list.innerHTML = "";
	starIndex=10;
	getquestionnairelist();
});
var search = document.getElementById("search");
function getquestionnairelist() {
	var data = {
		strwhere: search.value,
		lx: '', //selecttype
		nowindex: starIndex  
			//		starIndex: starIndex,
			//		endIndex: endIndex,
			//type: selecttype,
	};
	//alert(starIndex)
	common.postApi('GetProduct', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		for(var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (obj.DoPerson == getUserInfo().ID) {
			list.innerHTML += html_CanYu.replace('@ID', obj.product_id).replace('@STheme', obj.product_name).replace('@SContext', obj.ProModel+'/'+obj.specifications+'/'+obj.Brand).replace('@ReleaseTime', obj.C_code).replace('@flag', obj.C_style);
			//			} else {
			//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.id).replace('@STheme', obj.BudgetName).replace('@SContext', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime));
			//			}
		}
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
//		if(selecttype == "dqr") {
//			mui('#pullrefresh').pullRefresh().refresh(true);
//			//			if(dataArray.length > 0) {
//			//				news_hint[0].style.display = "block";
//			//				news_hint[0].innerText = dataArray.length;
//			//			} else {
//			//				news_hint[0].style.display = "none";
//			//			}
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//		} else {
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
//		}
	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var id = this.getAttribute('id');
		//mui.alert('暂无')
		//var webview = common.getTemplate('page1');
		//webview.loadURL('cldetail.html?id=' + id);
		search.blur();
		if(!detailPage) {
			detailPage.setStyle({
				left: '100%',
				zindex: 9999
			});
		}
		//var id = this.getAttribute('data-value');
		detailPage.loadURL('cldetail.html?id=' + id);
		openMenu();
	});
	var detailPageId = 'cldetail.html';
	var detailPage = null;
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
//		if(selecttype == "dqr") {
//			list.innerHTML = "";
//			starIndex = 10;
//			endIndex = 1000;
//			getquestionnairelist();
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		//common.initMessage();
	});
});