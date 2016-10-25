mui.init();
var commitLock = true;
var id; //主鍵
var selecttype;
var creator;
var isLastApprover;
var approveOpinion = ''; //审批意见
var status; //审批结果状态
var leaveObj;
mui.plusReady(function() {
	//后退键隐藏层
	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};
	// dataInit，由其他页面通过 mui.fire 触发
	// transDataHandler 是处理自定义事件的函数名称 ，名字自己随便写
	//window.addEventListener('dataInit', function(event) {
	//获取从父页面传过来的数据
	//id = event.detail.id;
	id = common.getQueryString("id");
	selecttype= common.getQueryString("selecttype");
	//common.showWaiting(true);
	var jsn = {
		strWhere: '',
		bid: id
			//		startIndex: '',
			//		endIndex: ''
	};
	common.postApi('GetBudgeDetail', jsn, function(response) {
		var s = eval(response.data);
		//		var dataArray = s[0];
		var obj = s.jhdata;
		
		//业务数据
		// alert(obj[0].ComponentName)
		//$('#project').text(obj[0].ComponentName);
		$('#Workzje').text(obj[0].DiscountAmount.toFixed(2));
		$('#Workjjje').text(obj[0].JJAmount.toFixed(2));
		$('#Workzcje').text(obj[0].ZCAmount.toFixed(2));
		$('#Workfjje').text(obj[0].FJAmount.toFixed(2));

		var data = s.detaildata;
		// alert(JSON.stringify(data))
		var item = "";
		var cn = "";
		var sum = 0;
		// $.each(objs, function (i, data) {
		for(var i = 0; i < data.length; i++) {
			// 	alert(data[i]['brand'] )
			if(data[i]['SUM'] == null) sum = 0;
			else sum = data[i]['SUM'];
			if(data[i]['ComponentName'] != cn) {
				item = "<tr><td background='../../../images/cell-grey.jpg' align='left' colspan='5' ><font size='2' ><b>&nbsp;&nbsp;" + data[i]['ComponentName'] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(合计：" + data[i]['BwSubTotal'] + ")</b></font></td></tr>" +
					"<tr><td ><a  class='sc' id='" + data[i]['xmid'] + "'>" + data[i]['brand'] + "</a></td>"
					//                             +"<td align='right'>"+ data[i]['zc_price'] + "</td><td align='right'>" + data[i]['fc_price'] + "</td><td align='right'>" + data[i]['rg_price']  + "</td>"
					+
					"<td align='right'>" + data[i]['TotalPrice'] + "</td><td align='right'>" + sum + data[i]['unit']+"</td> " +
					" <td align='right'>" + data[i]['je'] + "</td>"//"<td>" + data[i]['unit'] + "</td> " //<td>" + data[i]['proremarks'] + "</td>
					+
					" </tr>";
			} else {
				item = "<tr><td><a class='sc' id='" + data[i]['xmid'] + "'>" + data[i]['brand'] + "</a></td>"
					//                         +"<td align='right'>" + data[i]['zc_price'] + "</td><td align='right'>" + data[i]['fc_price'] + "</td><td align='right'>" + data[i]['rg_price']  + "</td>"
					+
					"<td align='right'>" + data[i]['TotalPrice'] + "</td><td align='right'>" + sum + data[i]['unit']+ "</td> " +
					" <td align='right'>" + data[i]['je'] + "</td>"//""<td>" + data[i]['unit'] + "</td> " //<td>" + data[i]['proremarks'] + "</td>
					+
					" </tr>";
			}
			$('.table1').append(item);
			// alert(item)
			cn = data[i]['ComponentName'];
		}

		var	fjdetail=s.fjdata;
		//alert(JSON.stringify(fjdetail))
		for(var i = 0; i < fjdetail.length; i++) {
				if(i==0)
				{
				item ="<tr><td style='background:#ccc'; align='center' ><font size='2' ><b>&nbsp;&nbsp;附加费名称&nbsp;</b></font></td>"
				+"<td style='background:#ccc' align='center'  colspan='1' ><font size='2' ><b>&nbsp;&nbsp;费率&nbsp;</b></font></td>"
				+"<td style='background:#ccc' align='center'  colspan='2' ><font size='2' ><b>&nbsp;&nbsp;金额&nbsp;</b></font></td></tr>"
				+"<tr><td  align='left' >" + fjdetail[i]['RateName'] + "</td>"
				+"<td align='right'  colspan='1' >" + fjdetail[i]['rate'] + "</td>"
				+"<td align='right'  colspan='2' >" + fjdetail[i]['RateAmount'] + "</td></tr>";
				
			} else {
				item ="<tr><td align='left' >" + fjdetail[i]['RateName'] + "</td>"
				+"<td align='right'  colspan='1' >" + fjdetail[i]['rate'] + "</td>"
				+"<td align='right'  colspan='2' >" + fjdetail[i]['RateAmount'] + "</td></tr>";
				
			}
						$('.table1').append(item);
			}
		//		 
		//		$('#avatar').attr('src', obj.Avatar);
		//		$('#userName').text(obj.UserName);
		//		$('#ReleaseTime').text(obj.ReleaseTime);
		//		if (obj.SendState == '2') {
		//			$('#approveState').addClass('approve_pass');
		//			$('#approveState').text('审批通过');
		//		} else if (obj.SendState == '3') {
		//			$('#approveState').addClass('approve_notpass');
		//			$('#approveState').text('未通过');
		//		} else {
		//			$('#approveState').addClass('approve_wait');
		//			$('#approveState').text('等待审批');
		//		}
		//负责人
		//var toObj = s[1];
		//		var leaderHtml = ''; //负责人字符串
		//		for (var i = 0; i < toObj.length; i++) {
		//			var to = toObj[i];
		//			leaderHtml += to.UserName + ' ';
		//		}
		//		$('#workToUser').text(leaderHtml);
		//document.getElementById("leaveToUser").value = leaderHtml; //负责人
		//相关人
		//var ccObj = s[2];
		//		var relatedHtml = ''; //相关人字符串
		//		if (ccObj.length > 0) {
		//			for (var i = 0; i < ccObj.length; i++) {
		//				var cc = ccObj[i];
		//				relatedHtml += cc.UserName + ' ';
		//			}
		//			$('#workCcUser').text(relatedHtml);
		//		}
		//document.getElementById("leaveCcUser").value = relatedHtml; //相关人

		//var jsn = common.getApproveOrderBussiness(obj, toObj, ccObj);
		//alert(JSON.stringify(jsn));
		//		creator = jsn.creator;
		//
		//		isLastApprover = jsn.isLastApprover;
		//		document.getElementById("approveProcess").innerHTML = jsn.approveProcessHtml; //审批过程字符串
		//		if (jsn.creator == "0") {
		//			//发起人
		//			if (toObj[0].ApproveFlag == "0") {
		//				//第一个审批人没有审批,允许作废单据
		//				$('.approve_footer').removeClass('h');
		//				$('#btnBreak').removeClass('h');
		//			}
		//		} else if (jsn.creator == "1") {
		//			//负责人
		//			if (jsn.canApprove) {
		  if (selecttype == 'ys_dsh'||	selecttype == 'ys_dqr' ) 
			{
						$('.approve_footer').removeClass('h');
						$('#btnState').removeClass('h');
						$('#btnNopass').removeClass('h');
			}
		//		}
		common.closeWaiting();
	}, 'json');

	var detailPage = null;
	mui('#list').on('tap', '.sc', function(e) {
		//移除焦点,为了隐藏软键盘		 
		var id = this.getAttribute('id');
		var herf = '../../calendar/cldetail.html'
		if(!detailPage) {
			detailPage.setStyle({
				left: '100%',
				zindex: 9999
			});
		}
		//var id = this.getAttribute('data-value');
		detailPage.loadURL('../../calendar/cldetail.html?id=' + id);
		openMenu();
	});
	var detailPageId = '../../calendar/cldetail.html';
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
	//单据作废
	var btnBreak = document.getElementById("btnBreak");
	btnBreak.addEventListener("tap", function(e) {
		var btnArray = ['是', '否'];
		mui.confirm('单据作废后不可恢复,确认删除?', '确认操作', btnArray, function(e) {
			if(e.index == 0) {
				//确认
				status = "Delete";
				approve();
			} else {
				return;
			}
		});
	});

	var btnState = document.getElementById("btnState");
	//审批通过
	btnState.addEventListener("tap", function(e) {
//		if(isLastApprover) {
//			//是最后审批人
//			status = "AllPass";
//		} else {
//			status = 'Pass';
//		}
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.prompt('请输入你的审批意见：', '同意!', '审批意见', btnArray, function(e) {
			if(e.index == 0) {
				if(e.value) {
					approveOpinion = '审批意见:' + e.value;
				} else {
					approveOpinion = '审批意见:同意!';
				}
				approve();
				
			}

		});
	});
	var btnNopass = document.getElementById("btnNopass");
	//审批不通过
	btnNopass.addEventListener("tap", function(e) {
	selecttype= 'NoPass';
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.prompt('请输入你的审批意见：', '不同意!', '审批意见', btnArray, function(e) {
			if(e.index == 0) {
				if(e.value) {
					approveOpinion = '审批意见:' + e.value;
				} else {
					approveOpinion = '审批意见:不同意!';
				}
				approve();
			}
		});
	});
	//审批
	function approve() {
		if(!commitLock) {
			return;
		}
		var argu;
//		var pushTitle, pushContent;
//		if(status == "Pass") {
//			//流转到下一个审批人,点击消息跳转该我审批
//			argu = "{'vid':'projecthour','pid':'1'}";
//			pushTitle = getUserInfo().UserName + ":工时填报";
//			pushContent = leaveObj.WorkContent;
//		} else {
//			//点击消息跳转我发起的
//			argu = "{'vid':'projecthour','pid':'0'}";
//			pushTitle = "你的:工时填报";
//			pushContent = approveOpinion;
//		}
     
		var data = {
		 selecttype:selecttype,
		 id:id,
		 remarks:approveOpinion,
		 username:getUserInfo().UserName
//			ProjectCode: '',
//			WorkHour: '',
//			WorkContent: approveOpinion,
//			UserName: '',
//			WorkDate: leaveObj.WorkDate,
//			SendState: status,
//			hidToUser: '',
//			hidCcUser: '',
//			AddOrUpdate: 'UpdateAudit',
//			id: id,
//			pushTitle: pushTitle,
//			pushContent: pushContent,
//			param: argu
		};
		commitLock = false;
		//common.showWaiting(); 
		
		common.postApi('UpdateBudge', data, function(response) {	
			if(response.data == "success") {			
				common.toast("提交成功");
					currentViewHide();
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}
//	function go() {
//		var listWebview = plus.webview.currentWebview();
//		listWebview.loadURL('yslist.html');
//	}
	//隐藏当前页面

	function currentViewHide() {
	//alert(2)
	     plus.webview.currentWebview().back();
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {});
	}

});