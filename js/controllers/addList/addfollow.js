mui.init();
var id = "";
var newsStr = "";
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
	'<div class="comment_name">@commentUser</div>' +
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
	common.showWaiting(true);
	id = common.getQueryString("id");
	FetPinglunList();
 	mui.previewImage();

	//***************************************************评论*****************************************************
	common.click("fabiao", function() {
		commitComment_BtnPinglUN('4');
	});

	//提交评论
	function commitComment_BtnPinglUN(commenttype) {
			//alert(commitPinglunLock)
		if (!commitPinglunLock) {
			return;
		}
		var CommentText = document.getElementById("CommentText").value;
	
		if (CommentText.trim() == "") {
			return;
		}
		//if(!common.Verifauthority(2))//是否有权限发送
		common.Verifauthority(r_addfollow, function(result) { 
				 	if(!result)
		return;
		});
		common.showWaiting();
		var param = {
			id:common.getQueryString("id"),	
			name: getUserInfo().UserName,
			userid:getUserInfo().ID,
			username:getUserInfo().UserName,
			follow:	CommentText,
			departid:commenttype
//ID: "",
//			masterID: id,
//			commentFirst: CommentText,
//			commentType: commenttype, //4：新闻
//			type: "insert"
		};
		commitPinglunLock = false;
		common.postApi('AddCRM_Follow', param, function(msg) {
			//alert(msg.data ) 
			if (msg.data == "success")
			{
				commitPinglunLock = true;
				CommstartIndex = 0;
				document.getElementById("comments").innerHTML = "";
				document.getElementById("CommentText").value = "";
				FetPinglunList();
				document.getElementById("CommentText").blur();
			}
//			else {
//				common.closeWaiting();
//				commitPinglunLock = true;
//			}
		}, "json");
	}

	//获取评论列表
	function FetPinglunList() {
   //alert(common.getQueryString("id"))
		if (!commitPinglunLock) {
			return;
		}
		commitPinglunLock = false;
		var param = {
			id:common.getQueryString("id"),
			url:ApiUrl,
			nowindex:CommstartIndex+10
		}; 
   //alert(JSON.stringify(param))
		common.postApi('GetCRM_Follow', param, function(response) {	
			
			var data =  eval(response.data);//eval(response.data)[0];
			//alert(JSON.stringify(data))
			if (data) {

				allCount = data[0].TotalCount;
				document.getElementsByClassName('comment_title')[0].innerHTML = '跟进 (' + allCount + '条)';
				var oddCount = allCount - (CommstartIndex + 10); //没显示的评论数
				if (oddCount > 0) {
					document.getElementById("comment_hint").style.display = 'block';
					document.getElementById("comment_hint").innerHTML = '默认加载10条，其余隐藏<i>显示更多(' + oddCount + '条)';
				} else {
					document.getElementById("comment_hint").style.display = 'none';
				}
			} else {
				document.getElementById("comment_hint").innerHTML = '暂无跟进';
					common.closeWaiting();
			commitPinglunLock = true; return;
			}
     //alert(data.length)
			//输出列表
			for (var i = 0; i < data.length; i++) {
				
				var temp = CommtempHtml;
				var titleimg = data[i].Avatar;
				if (titleimg == '') {
					titleimg = '../images/testImg.png';
				}

				temp = temp.replace("@headImage", titleimg);
				temp = temp.replace("@commentUser", data[i].employee_name);
				temp = temp.replace("@commentTime", getDateDiff(getDateTimeStamp(data[i].Follow_date)));
				temp = temp.replace("@commentContent", data[i].Follow);

				document.getElementById("comments").innerHTML += temp;
			}
			//判断 更多 
			if (oddCount > 0) {
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
});