var list = document.getElementById("list");
var starIndex = 0;
var endIndex = 1000;
var selecttype = 'getSurveysList_NoRead';
var news_hint = document.getElementsByClassName("news_hint");
var html_No = '<a href="javascript:;" class="sc_cell sc_padding  mui-table-view-cell"  id="@ID">' +
	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
	'			<p class="label_describe_2">@SContext</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
	'	</a>';
var html_CanYu = '<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID" name="@name">' +
//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
//	'			<p class="label_describe_2"> @sr</p>' +//@SContext
//	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
//	'		<div class="sc_cell_data">' +
//	'			<p style="color:red">@ts</p>' +
//	'		</div>' +
	'	</a>';
$(function() {
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {

				if (i == 0) {
					starIndex = 0;
					endIndex = 1000;
					if (selecttype != "getSurveysList_NoRead") {
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'getSurveysList_NoRead';
				} else {
					starIndex = 0;
					endIndex = 10;
					if (selecttype != "getSurveysList_All") {
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'getSurveysList_All';
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

function getquestionnairelist() {
	var data = {
		type:'lx',
		strwhere:''
	};
 	//alert(JSON.stringify(data))    
	common.postApi('GetJPGL', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(dataArray))
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			
		
				list.innerHTML += html_CanYu.replace('@name', obj.params_name).replace('@ID', obj.params_id).replace('@STheme', obj.params_name).replace('@ReleaseTime', '').replace('@ts', '').replace('@sr','');
//			} else {
//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.ID).replace('@STheme', obj.STheme).replace('@SContext', substringAddPoint(obj.SContext, 15)).replace('@ReleaseTime', obj.ReleaseTime.substring(0, 10));
//			}
		}
		
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);//一次性的

 
	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var id = this.getAttribute('id');
		var dataname = this.getAttribute('name');
	common.jump('jpgj_detail.html?','jpgj',{dataid:id,dataname:dataname})
	//var template = common.getTemplate('jpgj', 'jpgj_detail.html?id=' + id+'&name='+id);

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
//		if (selecttype == "getSurveysList_NoRead") {
//			list.innerHTML = "";
//			starIndex = 0;
//			endIndex = 1000;
//			getquestionnairelist();
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		//common.initMessage();
	});
});