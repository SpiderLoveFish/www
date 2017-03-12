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

	//月，季，年
	var pNone = document.getElementById("pNone");
	var pOne = document.getElementById("pOne");
	var pTwo = document.getElementById("pTwo");
	var pThree = document.getElementById("pThree");
	$("#pNone").click(function() {
		pNone.className = 'choose_eattime';
		pOne.className = '';
		pTwo.className = '';
		pThree.className = '';
		starIndex=10;
		selecttype = 'M';		
		$("#NRed").text("当月");
		getActivityList();
		oClose();
	});
	$("#pOne").click(function() {
		pNone.className = '';
		pOne.className = 'choose_eattime';
		pTwo.className = '';
		pThree.className = '';
		starIndex=10;
		selecttype = 'S';
		$("#NRed").text("当季");
		getActivityList();
		oClose();
	});
	$('#pTwo').click(function() {
		pNone.className = '';
		pOne.className = '';
		pThree.className = '';
		pTwo.className = 'choose_eattime';
		starIndex=10;
		selecttype = 'Y';
		$("#NRed").text("当年");	
		getActivityList();
		oClose();
	});
	$('#pThree').click(function() {
		pNone.className = '';
		pOne.className = '';
		pTwo.className = '';
		pThree.className = 'choose_eattime';
		starIndex=10;
		selecttype = 'N';
		$("#NRed").text("默认");	
		getActivityList();
		oClose();
	});

//加班日期
	var pickDateBtnClickb = document.getElementById("pickDateBtnClickb");
	var pickDateBtnb = document.getElementById("pickDateBtnb");
	pickDateBtnClickb.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				pickDateBtnb.innerText = pickDateBtnb.value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			}, function(e) {
				//pickDateBtn.innerText = "请选择日期";
			}, {
				title: "请选择日期"
			});
		})
	
	var pickDateBtnClicke = document.getElementById("pickDateBtnClicke");
	var pickDateBtne = document.getElementById("pickDateBtne");
	pickDateBtnClicke.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				pickDateBtne.innerText = pickDateBtne.value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			}, function(e) {
				//pickDateBtn.innerText = "请选择日期";
			}, {
				title: "请选择日期"
			});
		})
		//提交
		common.click("btnSubmit", function() {		
			var pickDateBtnb = document.getElementById("pickDateBtnb").innerHTML;
		if (pickDateBtnb == "") {
				mui.alert("请选择开始日期");
			return;
		}
			var pickDateBtne = document.getElementById("pickDateBtne").innerHTML;
		if (pickDateBtne == "请选择日期") {
			mui.alert("请选择结束日期");
			return;
		}
		starIndex=10;
		selecttype = 'Z';
			$("#NRed").text("自定义");
		strwhere=pickDateBtnb+';'+pickDateBtne;
		getActivityList();
		oClose();
		
		})

function getActivityList() {
	//'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	var html = // '<li data-tags="@id" class="mui-table-view-cell mui-indexed-list-item addlist_stafflist"><div data-value="@id" class="divClick"><img src="@IsHostPic"><div class="addlist_staffname"><div class="addlist_name">@Title</div><span class="addlist_post">@Description</span></div></div><div class="addlist_makecall" data-mobile="@Mobilemsg"></div><div class="addlist_makemass" data-mobile="@Mobilecall"></div></li>';
	'<a id="@id" name="@score" class="sc_cell sc_padding mui-table-view-cell">' +'<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +  '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
	var data = {
		strwhere:strwhere,
		sfkh: sfkh,
		nowindex:  starIndex,
		type:selecttype
	};
     //alert(JSON.stringify(data))
	common.postApi('GetScoreList', data, function(response) {
		if(starIndex<=10)
		list.innerHTML="";
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			var jf='总积分:'+obj.Jf+'</br> 已发:'+obj.Jf1+' 已用:'+obj.Jf2;
			 var img='../../images/ScApp/general/headimg/headimg_01.png';
	      if(obj.Sex=="女")img='../../images/ScApp/general/headimg/headimg_02.png';
 			
 			
			if (sfkh == "N") {	
				if(obj.title==''){}else
				img=ApiUrl+'images/upload/portrait/'+obj.title;
			 
				var itemhtml = html.replace('@id', obj.ID).replace('@Title', (obj.Name)).replace('@Description',jf ).replace('@score',obj.Jf );
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
		//alert(starIndex)
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
//		if (selecttype == "N") {
//
//			if (dataArray.length > 0) {
//				news_hint[0].style.display = "block";
//				news_hint[0].innerText = dataArray.length;
//			} else {
//				news_hint[0].style.display = "none";
//			}
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//		} else {
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
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
				if (selecttype != "N") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'N';
			} else if (i == 1) {
				starIndex = 10;
				endIndex = 10;
				if (selecttype != "S") {
					list.innerHTML = "";
				} else {
					return;
				}
				selecttype = 'S';
			} else {
				starIndex = 10;
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
	
	//筛选
	$('.filtrate_btn').click(function() {
	$("#diolog_shade").show();
	$("#eat_diolog").show();
	});
	$('.oClose').click(function() {
		oClose();
	})


})
function oClose() {	
		$("#diolog_shade").hide();
		$("#eat_diolog").hide();
	}

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