var list = document.getElementById("list");
var starIndex = 10;
var endIndex = 1000;
var selecttype = 'M';
var strwhere = '';
var news_hint = document.getElementsByClassName("news_hint");
var sfkh = common.getQueryString("sfkh");
function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}
 

function getActivityList() {
		document.getElementById("list").innerHTML = "";	 
	//字母头
	var uType = 'ToOrCcUserList';
	if(selectType) {
		uType = selectType;
	}
	var sk = ''
	if(searchkey) {
		sk = searchkey;
	}
	var key = '';
	if(departmentId) {
		key = departmentId;
	}
	var uID = getUserInfo().ID;
	//'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	var html = // '<li data-tags="@id" class="mui-table-view-cell mui-indexed-list-item addlist_stafflist"><div data-value="@id" class="divClick"><img src="@IsHostPic"><div class="addlist_staffname"><div class="addlist_name">@Title</div><span class="addlist_post">@Description</span></div></div><div class="addlist_makecall" data-mobile="@Mobilemsg"></div><div class="addlist_makemass" data-mobile="@Mobilecall"></div></li>';
	'<a id="@id" name="@score" class="sc_cell sc_padding mui-table-view-cell">' +'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +  '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
	var data = {
		keyword: key,
		ID: uID,
		url: ApiUrl,
		topnumber: 50,
		searchkey: sk
	};
	//alert(JSON.stringify(data))
	common.postApi('GetCustomerList', data, function(response) {
		
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		list.innerHTML="";
		news_hint[0].style.display = "block";
 				news_hint[0].innerText = dataArray.length;
			for(var i = 0; i < dataArray.length; i++) {
				var temp; //临时变量
				var obj = dataArray[i];
 			
				temp = temHead;
					document.getElementById("list").innerHTML += temp.replace("@headLetter", obj.header).replace("@headLetter", obj.header);
			 var avatar = obj.Avatar;
				if(avatar == '' || avatar == null || avatar == 'null')
					avatar = '../../images/ScApp/general/headimg/headimg_02.png';
				temp = temBody;
				temp = temp.replace("@id", obj.id);
				temp = temp.replace("@Header", obj.header + obj.Customer + obj.tel + obj.address);
				temp = temp.replace("@Mobilecall", obj.tel);
				temp = temp.replace("@Mobilemsg", obj.id);
				temp = temp.replace("@titleimg", avatar);
				temp = temp.replace("@UserName", obj.Customer);
				temp = temp.replace("@DepartmentName", obj.address);
			 
				list.innerHTML += temp;
			} else {
				list.innerHTML += html.replace('@id', obj.ID).replace('@Title', substringAddPoint(obj.Name, 15)).replace('@Description', jf).replace('@IsHostPic', img).replace('@flag', '客户').replace('@ReleaseDateTime', obj.Tel).replace('@score',obj.Jf );
//				.replace('@ReleaseDateTime', obj.ReleaseDateTime.substring(0, 10)).replace('@IsHostPic', obj.IsHostPic).replace('@flag', '');		 
			}
		}
		//alert(starIndex)
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
 
	}, 'json');
}
$(function() {
	 
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
				mui('#pullrefresh').pullRefresh().refresh(true);
			}, 50);
		 
	});
	 

})
 
mui.plusReady(function() {
	mui('.container').on('tap', 'a', function(e) {
		var id = this.getAttribute('id');
		var score= this.getAttribute('name');
		var template = common.getTemplate('jfdetail', 'activity_detail.html?id=' + id+'&sfkh='+sfkh+'&score='+score);

	});
	mui('.mui-bar-nav').on('tap', '.btn_post_activ', function(e) {
		var template = common.getTemplate('jfapp', 'activity_apply.html?');
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

//		if (selecttype == "N") {
//			list.innerHTML = "";
//			starIndex = 10;
//			endIndex = 1000;
//			//getActivityList();
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		//common.initMessage();
	});
});