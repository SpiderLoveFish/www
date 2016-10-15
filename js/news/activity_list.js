var list = document.getElementById("list");
var starIndex =10;
var endIndex = 1000;
var selecttype = 'getActivityList_NoRead';
//var news_hint = document.getElementsByClassName("news_hint");

function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}

function getActivityList() {
	var html = '<a id="@id" class="sc_cell sc_padding mui-table-view-cell">' + '<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' + '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe_2">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
//	var data = {
//		ID: '',
//		type: selecttype,
//		strWhere: '',
//		starIndex: starIndex,
//		endIndex: endIndex,
	//};
	var data = {
				SelectType: 'IndexMsg',
				startIndex: '1',
				endIndex:starIndex
			};
	common.postApi('GetMessage', data, function(response) {
	
		dataArray = eval(response.data);
		//alert(dataArray[0].length)
		for (var i = 0; i < dataArray[0].length; i++) {
			var obj = dataArray[0][i];
			//if (selecttype == "getActivityList_All") {
				var imgs=obj.news_content.split('.jpg');
				var desc= substringAddPoint(imgs[imgs.length-1],20).trim().replace('</br>','');
				//alert(desc)
				var itemhtml = html.replace('@id', obj.ID).replace('@Title', (obj.Title)).replace('@Description',desc).replace('@ReleaseDateTime', obj.ReleaseTime).replace('@IsHostPic', ApiUrl+'images/upload/temp/'+obj.IsHostPic);
				if (obj.create_id == getUserInfo().ID) {
					itemhtml = itemhtml.replace('@flag', '我发布');
				} 
				else {
					itemhtml = itemhtml.replace('@flag', '');//我已参与
				}
				list.innerHTML += itemhtml;
//			} else {
//				list.innerHTML += html.replace('@id', obj.ID).replace('@Title', (obj.Title)).replace('@Description', (obj.Title)).replace('@ReleaseDateTime', obj.ReleaseTime).replace('@IsHostPic', obj.IsHostPic).replace('@flag', '');
//			}
		}
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray[0].length < 10)); //参数为true代表没有更多数据了。
	
//
//		if (selecttype == "getActivityList_NoRead") {
//
//			if (dataArray[0].length > 0) {
//				news_hint[0].style.display = "block";
//				news_hint[0].innerText = dataArray[0].length;
//			} else {
//				news_hint[0].style.display = "none";
//			}
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//		} else {
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray[0].length < 10)); //参数为true代表没有更多数据了。
//		}
	}, 'json');
}
$(function() {
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			if (i == 0) {
				starIndex = 10;
				endIndex = 1000;
				if (selecttype != "getActivityList_NoRead") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'getActivityList_NoRead';
			}
//			else if (i == 1) {
//				starIndex = 10;
//				endIndex = 10;
//				if (selecttype != "getActivityList_All") {
//					list.innerHTML = "";
//				} else {
//					return;
//				}
//				selecttype = 'getActivityList_All';
//			} else {
//				starIndex = 10;
//				endIndex = 10;
//				if (selecttype != "getActivityList_My") {
//					list.innerHTML = "";
//				} else {
//					return;
//				}
//				selecttype = 'getActivityList_My';
//			}
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
				mui('#pullrefresh').pullRefresh().refresh(true);
			}, 50);
		})
	});
})
mui.plusReady(function() {
	mui('.container').on('tap', 'a', function(e) {
		var id = this.getAttribute('id');
		var template = common.getTemplate('page2', 'activity_detail.html?id=' + id);

	});
	mui('.mui-bar-nav').on('tap', '.btn_post_activ', function(e) {
		var template = common.getTemplate('page2', 'activity_apply.html?');
	});

	if (plus.os.name != "Android") {
		var pullrefreshAll = document.getElementById("pullrefresh");
		pullrefreshAll.style.marginTop = CommonTop;
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

//		if (selecttype == "getActivityList_NoRead") {
//			list.innerHTML = "";
//			starIndex = 0;
//			endIndex = 1000;
//			getActivityList();
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		common.initMessage();
	});
});