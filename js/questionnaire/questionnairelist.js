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
var html_CanYu = '<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>@STheme</p>' +
	'			<p class="label_describe_2">@SContext 生日：@sr</p>' +
	'			<span class="sc_comment">@ReleaseTime</span>' +
	'		</div>' +
	'		<div class="sc_cell_data">' +
	'			<p style="color:red">还有天数：@ts</p>' +
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
		url:ApiUrl
//		strWhere: '',
//		starIndex: starIndex,
//		endIndex: endIndex,
//		type: selecttype,
	};
//+---------------------------------------------------  
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
//+---------------------------------------------------  
function daysBetween(DateOne,DateTwo)  
{   
    var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
    var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
    var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
  
    var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
    var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
  
    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
    return Math.abs(cha);  
}  
	common.postApi('GetUserList', data, function(response) {
		dataArray = eval(response.data);
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			
			var bsr='2016-10-22';
		 var myDate = new Date();
//		  var aP = document.getElementsByClassName('label_describe_2');
//		  aP.style.color = 'red';
			var bts=daysBetween(bsr,myDate.getFullYear()+'-'+myDate.getMonth()+'-'+myDate.getDate());
		//	if (obj.Flag == '3') {
				list.innerHTML += html_CanYu.replace('@IsHostPic', obj.Avatar).replace('@ID', obj.UserId).replace('@STheme', obj.UserName).replace('@SContext', (obj.DepartmentName)).replace('@ReleaseTime', obj.tel).replace('@ts', bts).replace('@sr',bsr);
//			} else {
//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.ID).replace('@STheme', obj.STheme).replace('@SContext', substringAddPoint(obj.SContext, 15)).replace('@ReleaseTime', obj.ReleaseTime.substring(0, 10));
//			}
		}
		starIndex = starIndex + 10;
		if (selecttype == "getSurveysList_NoRead") {
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
		webview.loadURL('questionnairedetail.html?id=' + id);
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
		if (selecttype == "getSurveysList_NoRead") {
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