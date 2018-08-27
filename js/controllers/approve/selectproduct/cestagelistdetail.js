var list = document.getElementById("list");
var starIndex = 10;
var endIndex = 1000;
var selecttype = 'dqr';
var cid= common.getQueryString("cid"); 
common.backOfHideCurrentWebview();
var UserArray; //负责人userid列表
var UserList = "";
UserArray = new Array();
var menu = null;
	var showMenu = false;
 
 
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
//	' </div> </li>';
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
		cid:cid,
		strwhere:search.value,
		id:'',
		uid: getUserInfo().ID 
	};
	//alert(starIndex)
	common.postApi('GetPurchaseList', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(dataArray))
		for(var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (obj.DoPerson == getUserInfo().ID) {
			list.innerHTML += html_CanYu.replace('@ID', obj.id ).replace('@tag', obj.IsStatus ).replace('@STheme', obj.product_name).replace('@SContext', obj.name).replace('@ReleaseTime', obj.category_name).replace('@flag', obj.C_code);
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
						var tag = this.getAttribute('tag');
		var template = common.getTemplate('activity_apply', 'activity_apply.html?id=' + id+'&cid='+cid+'&tag='+tag);

	});
	 document.getElementById("btnAdd").addEventListener('tap', function() {
			//	document.getElementById("txtGroupName").blur();
				userListInit(UserArray);
				openMenu();
			});
	 
	 mui.back = function() {
		//document.getElementById("txtGroupName").blur();
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};
	 
	mask = mui.createMask(_closeMenu);
	//自定义事件 传入用户userid集合到UserList页面
	function userListInit(userList) {
		mui.fire(menu, 'userListInit', {
			userList: userList
		});
	}
	function openMenu() {
		if (!showMenu) {
			//侧滑菜单处于隐藏状态，则立即显示出来；
			//显示完毕后，根据不同动画效果移动窗体；
			menu.show('none', 0, function() {
				menu.setStyle({
					left: '0%',
					transition: {
						duration: 150
					}
				});
			});
			//显示遮罩
			mask.show();
			showMenu = true;
		}
	}
	
/**
	 * 关闭侧滑菜单（业务部分）
	 */

	function _closeMenu() {
		if (showMenu) {
			//关闭遮罩；
			//主窗体开始侧滑；
			menu.setStyle({
				left: '100%',
				transition: {
					duration: 150
				}
			});
			setTimeout(function() {
				menu.hide();
			}, 200);
			//改变标志位
			showMenu = false;
		}
	}
	setTimeout(function() {
		//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'user_list',
			url: '../../common/product_list.html',
			styles: {
				left: '0%',
				width: '100%',
				zindex: 9997
			}
		});
	}, 300);
	
	
	window.addEventListener('transData1', transDataHandler1);
	function transDataHandler1(event) {
		list.innerHTML = "";	 
				getquestionnairelist();
	}
	// transData是自定义事件的名称，由其他页面通过 mui.fire 触发
	// transDataHandler 是处理自定义事件的函数名称 ，名字自己随便写
	window.addEventListener('transData', transDataHandler);
	//自定义事件处理逻辑 event参数不能少 
	function transDataHandler(event) {
	
		//获取从B页面传过来的数据
		mask.close();
		var tableview = eval(event.detail.tableview);
		//var User = document.getElementById("toUser");
		UserArray = new Array();
		//User.innerHTML = '';
		UserList = '';
		//选择的负责人
		for (var i = 0; i < tableview.length; i++) {
			var obj = tableview[i];
			UserArray.push(obj.UserId);
			//User.innerHTML += template.replace("@name", obj.UserName);
			UserList += obj.UserId + ",";
		}   
		if(UserList.length>1)
		UserList=UserList.slice(0,UserList.length-1);//去掉最后一个，
		var data1={
			cid:cid,
			pid:UserList,
			uid:getUserInfo().ID ,
			style:'All'
		};
		  //alert(JSON.stringify(data1))
		 common.postApi("InsertPurList", data1, function(response) {
			// alert(JSON.stringify(response.data))
			if (response.data == "success") {
				mui.toast("提交成功!!!");
				list.innerHTML = "";	 
				getquestionnairelist();
			} else {
				mui.toast("提交失败,检查是否有重复，请稍候重试..");
			}
			//commitLock = true;
			 common.closeWaiting();
		}, 'json');
		 
		 
	}
	//自定义事件 关闭menu层
	window.addEventListener('closeMenu', closeMenuHandler);

	function closeMenuHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
	}
	//------------------------------处理完成--------------------------------------


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