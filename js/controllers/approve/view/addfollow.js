mui.init();
var id = "";
var strwhere = "";
var isEdit = false;
var status = '2';
var commitLock = true;
var commitPinglunLock = true; //评论锁
var approveOrder;
var leaderArray; //负责人json串
var IsNoApprove = false;
var IsNoLastApprove = false; //是否是最后一个负责人
var ToApproveOrder = ""; //下一个负责人
var IsNoCommit = true;
var CommstartIndex = 0;
var CommentPageCount = 10;
var currentUserId = getUserInfo().UserId; //当前人
var CommtempHtml = '<li class="comment_list">' +
	'<img class="comment_head" src="@headImage" alt="" />' +
	'<div class="comment_name">@commentUser(@customer)</div>' +
	'<div class="comment_time">@commentTime</div>' +
	'<i class="comment_reply" style="display: none;">回复</i>' +
	'<p class="comment_container">@commentContent</p>' +
	'</li>';

mui.plusReady(function() {

	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};
	//common.backOfHideCurrentWebview();
	//common.showWaiting(true);
	FetPinglunList();
 	//mui.previewImage();

	//***************************************************评论*****************************************************
 
 
	//获取评论列表
	function FetPinglunList() {
   
		if (!commitPinglunLock) {
			return;
		}
		commitPinglunLock = false;
		var param = {
			nowindex:CommstartIndex+10,
			strwhere:strwhere,
			url:ApiUrl,
			userid:getUserInfo().ID
		}; 
  		// alert(JSON.stringify(param))
		common.postApi('GetFollowList', param, function(response) {	
			if(CommstartIndex==0)
			document.getElementById("comments").innerHTML='';
		  //alert(CommstartIndex+JSON.stringify(response))
			var data =  eval(response.data);//eval(response.data)[0];
		 	if (data) {
		 		//alert(data[1].Total+JSON.stringify(data[1]))
			var allCount = data[1].Total;
				//document.getElementsByClassName('comment_title')[0].innerHTML = '跟进 (' + allCount + '条)';
				//var oddCount = allCount - (CommstartIndex + 10); //没显示的评论数
				if (allCount==10) {
					document.getElementById("comment_hint").style.display = 'block';
					document.getElementById("comment_hint").innerHTML = '默认加载10条，其余隐藏<i>显示更多';
				} else {
					document.getElementById("comment_hint").style.display = 'none';
				}
			} else {
				document.getElementById("comment_hint").innerHTML = '暂无跟进';
					common.closeWaiting();
			commitPinglunLock = true; return;
			}
			
    		//输出列表
			for (var i = 0; i < allCount; i++) {
				//if(data[0][i]=='undefined')continue;
				var temp = CommtempHtml;
			//	alert(JSON.stringify(data[0][i]))
				var titleimg = data[0][i].Avatar;
				if (titleimg == '') {
					titleimg = '../images/testImg.png';
				}

				temp = temp.replace("@headImage", titleimg);
				temp = temp.replace("@commentUser", data[0][i].employee_name).replace("@customer", data[0][i].Customer_name);
				temp = temp.replace("@commentTime", getDateDiff(getDateTimeStamp(data[0][i].Follow_date)));
				temp = temp.replace("@commentContent", data[0][i].Follow);

				document.getElementById("comments").innerHTML += temp;
			}
			//判断 更多 
			if (allCount == 10) {
				common.click('comment_hint', FetPinglunList);
				CommstartIndex += 10;
			}
			common.closeWaiting();
			commitPinglunLock = true;

		}, 'json');
//common.closeWaiting();
//	commitPinglunLock = true;
	}
	//---------------------------------------------------  
	// 日期格式化  
	// 格式 YYYY/yyyy/YY/yy 表示年份  
	// MM/M 月份  
	// W/w 星期  
	// dd/DD/d/D 日期  
	// hh/HH/h/H 时间  
	// mm/m 分钟  
	// ss/SS/s/S 秒  
	//alert(DateFormat('YYYY-MM-dd hh:mm 星期w'));
	//---------------------------------------------------  
	function DateFormat(mDate, formatStr) {


		var myDate = new Date(mDate); //正确

		//alert(date.getFullYear());
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, myDate.getFullYear());
		str = str.replace(/yy|YY/, (myDate.getYear() % 100) > 9 ? (myDate.getYear() % 100).toString() : '0' + (myDate.getYear() % 100));

		str = str.replace(/MM/, parseInt(myDate.getMonth()) + 1 > 9 ? (parseInt(myDate.getMonth()) + 1).toString() : '0' + (parseInt(myDate.getMonth()) + 1));
		str = str.replace(/M/g, parseInt(myDate.getMonth()) + 1);

		str = str.replace(/w|W/g, Week[myDate.getDay()]);

		str = str.replace(/dd|DD/, myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate());
		str = str.replace(/d|D/g, myDate.getDate());

		str = str.replace(/hh|HH/, myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours());
		str = str.replace(/h|H/g, myDate.getHours());
		str = str.replace(/mm/, myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes());
		str = str.replace(/m/g, myDate.getMinutes());

		str = str.replace(/ss|SS/, myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds());
		str = str.replace(/s|S/g, myDate.getSeconds());

		return str;
	}

	function strformatdata(str) {
		str = str.replace(/-/g, "/");
		var date = new Date(str);
		return date;
	}
	//隐藏表情选择界面
	function hideEmojify() {
		var plus_btns = $("#plus_btns"),
			emoji_list = $("#emoji_list");
		plus_btns.hide();
		emoji_list.hide();
	}
	
	setTimeout(function() {
			mui.preload({
				id: departmentId,
				url: 'search.html',
				styles: {
					right: "20%",
					width: '80%',
					zindex: 9997
				}
			});
		}, 150);
		//监听部门页面请求关闭
		window.addEventListener('hidedepartmentPage', function(event) {
			_closeMenuDepartment();
			maskDepartment.close();
			id = event.detail.id;
			CommstartIndex=0;
			strwhere=id	;
			FetPinglunList();
			//GetUserList("search", 'search', id);
		});
 
});

var maskDepartment = mui.createMask(_closeMenuDepartment);
	var departmentPage = null;
	var departmentId = 'search.html';
	mui('.mui-bar-nav').on("tap", '#icon-menu', function(e) {
		//移除焦点,为了隐藏软键盘
		//document.getElementById("search").blur();
		if(!departmentPage) {
			departmentPage = plus.webview.getWebviewById(departmentId);
			departmentPage.setStyle({
				right: '100%',
				zindex: 9999
			});
		}
		openMenuDepartment();
	});
		/*
	 * 显示菜单菜单
	 */
	function openMenuDepartment() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		departmentPage.show('none', 0, function() {
			departmentPage.setStyle({
				right: '20%',
				transition: {
					duration: 150
				}
			});
		});
		maskDepartment.show(); //遮罩
	}
	/**
	 * 关闭侧滑菜单(业务部分)
	 */
	function _closeMenuDepartment() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}
		//主窗体开始侧滑；
		departmentPage.setStyle({
			right: '100%',
			transition: {
				duration: 100
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			departmentPage.hide();
		}, 100);
	}
	/***********************************部门侧滑end*****************************************/
