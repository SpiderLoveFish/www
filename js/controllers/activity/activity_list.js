var list = document.getElementById("list");
var starIndex = 0;
var endIndex = 1000;
var selecttype = 'N';
var news_hint = document.getElementsByClassName("news_hint");

function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}

function getActivityList() {
	//'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	var html = // '<li data-tags="@id" class="mui-table-view-cell mui-indexed-list-item addlist_stafflist"><div data-value="@id" class="divClick"><img src="@IsHostPic"><div class="addlist_staffname"><div class="addlist_name">@Title</div><span class="addlist_post">@Description</span></div></div><div class="addlist_makecall" data-mobile="@Mobilemsg"></div><div class="addlist_makemass" data-mobile="@Mobilecall"></div></li>';
	'<a id="@id" name="@score" class="sc_cell sc_padding mui-table-view-cell">' +'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +  '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe_2">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
	var data = {
		strwhere: '',
		sfkh: selecttype,
		nowindex:  10
	};
	common.postApi('GetScore', data, function(response) {
		//alert(JSON.stringify(response))
		dataArray = eval(response.data);
		
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			var jf='总积分:'+obj.Jf+'</br> 已发积分:'+obj.Jf1+' 已用积分:'+obj.Jf2;
			 var img='../../images/ScApp/general/headimg/headimg_01.png';
	      if(obj.Sex=="女")img='../../images/ScApp/general/headimg/headimg_02.png';
 			 
			if (selecttype == "N") {
				if(obj.title!='')
				img=ApiUrl+'images/upload/portrait/'+obj.title;
				var itemhtml = html.replace('@id', obj.ID).replace('@Title', substringAddPoint(obj.Name, 15)).replace('@Description',jf ).replace('@score',obj.Jf );
				//.replace('@ReleaseDateTime', obj.ReleaseDateTime.substring(0, 10)).replace('@IsHostPic', obj.Sex);
//				if (obj.Flag == "2") {
	     	itemhtml = itemhtml.replace('@flag', '员工').replace('@ReleaseDateTime', obj.Tel).replace('@IsHostPic', img);
//				} else {
//					itemhtml = itemhtml.replace('@flag', '我已参与');
//				}
				list.innerHTML += itemhtml;
			} else {
				list.innerHTML += html.replace('@id', obj.ID).replace('@Title', substringAddPoint(obj.Name, 15)).replace('@Description', jf).replace('@IsHostPic', img).replace('@flag', '客户').replace('@ReleaseDateTime', obj.Tel).replace('@score',obj.Jf );
//				.replace('@ReleaseDateTime', obj.ReleaseDateTime.substring(0, 10)).replace('@IsHostPic', obj.IsHostPic).replace('@flag', '');		 
			}
		}
		starIndex = starIndex + 10;
		if (selecttype == "N") {

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
$(function() {
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			if (i == 0) {
				starIndex = 0;
				endIndex = 1000;
				if (selecttype != "N") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'N';
			} else if (i == 1) {
				starIndex = 0;
				endIndex = 10;
				if (selecttype != "Y") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'Y';
			} else {
				starIndex = 0;
				endIndex = 10;
				if (selecttype != "Y") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'Y';
			}
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
		var score= this.getAttribute('name');
		var template = common.getTemplate('page2', 'activity_detail.html?id=' + id+'&sfkh='+selecttype+'&score='+score);

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

		if (selecttype == "N") {
			list.innerHTML = "";
			starIndex = 0;
			endIndex = 1000;
			getActivityList();
		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		common.initMessage();
	});
});