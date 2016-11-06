mui.init();
var commitLock = true;
var id; //主鍵
var creator;
var isLastApprover;
var approveOpinion = ''; //审批意见
var status; //审批结果状态
var leaveObj;
var totalscore=0;
mui.plusReady(function() {
	mui.previewImage();
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
	var 	sfkh = common.getQueryString("sfkh");
	 totalscore= common.getQueryString("score");
	// alert(totalscore)
	if(sfkh=='NY')//个人查询
	{
		sfkh='N';
		document.getElementById("divtop").style.display='none';
//				$('.approve_footer').removeClass('h');
//				$('#btnState').removeClass('h');
//				$('#btnNopass').removeClass('h');
		
	}
	else{
		$('.approve_footer').removeClass('h');
				$('#btnState').removeClass('h');
				$('#btnNopass').removeClass('h');
	}
	
	
	document.getElementById("approve_process_title").innerHTML ='积分使用过程('+totalscore+')';
	//common.showWaiting(true);
	var jsn = {
		ID: id,
		sfkh: sfkh 
	};
	 
	common.postApi('GetScoreDetail', jsn, function(response) {
//		alert(JSON.stringify(response))
		var obj = eval(response.data);
		
//		var dataArray = s[0];
//		var obj = leaveObj = dataArray[0];
//		var pic = s[3];
		var imgHtml = '无'; //没图片显示无(否则会有样式错位问题)
//		for (var i = 0; i < pic.length; i++) {
//			imgHtml = '';
//			var p = pic[i];
//			imgHtml += '<img src="' + p.PicURL + '" data-preview-src="" data-preview-group="1">';
//		}
		//$('#pic').html(imgHtml);
		//业务数据
//		$('#Theme').text(obj.Theme);
//		$('#MContext').text(obj.MContext);
//		$('#avatar').attr('src', obj.Avatar);
//		$('#userName').text(obj.UserName);
//		$('#ReleaseTime').text(obj.ReleaseTime);
//		if (obj.State == '2') {
//			$('#approveState').addClass('approve_pass');
//			$('#approveState').text('审批通过');
//		} else if (obj.State == '3') {
//			$('#approveState').addClass('approve_notpass');
//			$('#approveState').text('未通过');
//		} else {
//			$('#approveState').addClass('approve_wait');
//			$('#approveState').text('等待审批');
//		}
		//负责人
		var toObj =obj;// s[1];
		//		var leaderHtml = ''; //负责人字符串
		//		for (var i = 0; i < toObj.length; i++) {
		//			var to = toObj[i];
		//			leaderHtml += to.UserName + ' ';
		//		}
		//		$('#toUser').text(leaderHtml);
		//document.getElementById("leaveToUser").value = leaderHtml; //负责人
		//相关人
		var ccObj =null;// s[2];
//		var relatedHtml = ''; //相关人字符串
//		if (ccObj.length > 0) {
//			for (var i = 0; i < ccObj.length; i++) {
//				var cc = ccObj[i];
//				relatedHtml += cc.UserName + ' ';
//			}
//			$('#ccUser').text(relatedHtml);
//		}
		//document.getElementById("leaveCcUser").value = relatedHtml; //相关人
 
		var jsn = getApproveOrderBussiness(obj, toObj, ccObj);
	 
		//creator = jsn.creator;

		//isLastApprover = jsn.isLastApprover;
		document.getElementById("approveProcess").innerHTML = jsn.approveProcessHtml; //审批过程字符串
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
//				$('.approve_footer').removeClass('h');
//				$('#btnState').removeClass('h');
//				$('#btnNopass').removeClass('h');
//			}
//		}
		common.closeWaiting();
	}, 'json');

getApproveOrderBussiness = function(obj, toData, ccData) {
		var creator = 0, //发起人|负责人|相关人
			approveProcessHtml = '', //审批过程html代码
			isLastApprover = false, //是否是最后审批人
			canApprove = false;
		//当前人userid
		var currentUserId = getUserInfo().UserId;
		//approveProcessHtml += '<li class="state_icon_pass"><div class="approve_state_list"><div class="sc_cell_hd"><div class="sc_cell_bd sc_cell_primary"><p>' + obj.InEmpName + '</p><p class="label_describe">积分申请</p></div><div class="sc_cell_data">' + (obj.InDate) + '</div></div></li>';
		//obj.UserName + '发起申请' + obj.ReleaseTime + '<br/>';
//		if (obj.UserId == currentUserId) {
//			//当前人是发起人
//			creator = 0;
//		}
		if (toData) {
			for (var i = 0; i < toData.length; i++) {
				var item = toData[i];
//				if (item.Jflx == '0') {
//					approveProcessHtml += '<li class="state_icon_wait"><div class="approve_state_list"><div class="sc_cell_hd"><img src="' + item.Avatar + '"></div><div class="sc_cell_bd sc_cell_primary"><p>' + item.InEmpName + '</p><p class="label_describe"></p></div><div class="sc_cell_data"></div></div></li>'
//				} else
				if (item.Jflx == '发放积分') {
					approveProcessHtml += '<li class="state_icon_pass"><div class="approve_state_list"><div class="sc_cell_hd"> <div class="sc_cell_bd sc_cell_primary"><p>' + item.InEmpName + '('+item.Jf+')</p><p class="label_describe">' + item.Content + '</p></div><div class="sc_cell_data">' +  (item.InDate) + '</div></div></li>';
				} else {
					approveProcessHtml += '<li class="state_icon_notpass"><div class="approve_state_list"><div class="sc_cell_hd"> <div class="sc_cell_bd sc_cell_primary"><p>' + item.InEmpName + '('+item.Jf+')</p><p class="label_describe">' + item.Content + '</p></div><div class="sc_cell_data">' +  (item.InDate) + '</div></div></li>';
				}
//				if (currentUserId == item.UserId) {
//					creator = 1; //负责人
//					if (obj.ApproveOrder == item.ApproveOrder) {
//						if (item.ApproveFlag == '0') { //未审批
//							canApprove = true;
//						}
//						//审批流对应
//						if (i == (toData.length - 1)) { //负责人是按approveorder升序查询,所以最后一条数据为最后审批人
//							isLastApprover = true;
//						} else {
//
//						}
//					}
//				}
			}
		}
		if (ccData) {
			for (var i = 0; i < ccData.length; i++) {
				var item = ccData[i];
				if (currentUserId == item.UserId) {
					creator = 2; //相关人
					break;
				}
			}
		}
		return {
			creator: creator,
			approveProcessHtml: approveProcessHtml,
			isLastApprover: isLastApprover,
			canApprove: canApprove
		};
	}
 
	//单据作废
	var btnBreak = document.getElementById("btnBreak");
	btnBreak.addEventListener("tap", function(e) {
		var btnArray = ['是', '否'];
		mui.confirm('单据作废后不可恢复,确认删除?', '确认操作', btnArray, function(e) {
			if (e.index == 0) {
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
		if (isLastApprover) {
			//是最后审批人
			status = "AllPass";
		} else {
			status = 'Pass';
		}
		var txtscore = common.numValiAlert(document.getElementById("txtscore").value, "请填写积分");
			if (!txtscore) {
				return;
			}	
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		                mui.confirm('确认添加积分：'+txtscore, '确认?', btnArray, function(e) {
                    if (e.index == 1) {
                       
                    } else {
                      	approve();
                    }
                })
       
//		mui.prompt('请输入你的审批意见：', '同意!', '审批意见', btnArray, function(e) {
//			if (e.index == 0) {
//				if (e.value) {
//					approveOpinion = '审批意见:' + e.value;
//				} else {
//					approveOpinion = '审批意见:同意!';
//				}
//				approve();
//			}
//
//		});
	});
	var btnNopass = document.getElementById("btnNopass");
	//审批不通过
	btnNopass.addEventListener("tap", function(e) {
		status = 'NoPass';
		var txtscore = common.numValiAlert(document.getElementById("txtscore").value, "请填写积分");
			if (!txtscore) {
				return;
			}
			txtscore=-txtscore
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		        mui.confirm('确认消除积分：'+txtscore, '确认?', btnArray, function(e) {
                    if (e.index == 1) {
                       
                    } else {
                      	approve();
                    }
                })
//		mui.prompt('请输入你的审批意见：', '不同意!', '审批意见', btnArray, function(e) {
//			if (e.index == 0) {
//				if (e.value) {
//					approveOpinion = '审批意见:' + e.value;
//				} else {
//					approveOpinion = '审批意见:不同意!';
//				}
//				approve();
//			}
//		});
	});
	//审批
	function approve() {
		if (!commitLock) {
			return;
		}
		var argu;var sfadd;
		var pushTitle, pushContent;
		if (status == "Pass") {
			sfadd="Y";
			//流转到下一个审批人,点击消息跳转该我审批
//			argu = "{'vid':'generalapprove','pid':'1'}";
//			pushTitle = getUserInfo().UserName + "的通用申请:" + leaveObj.Theme;
//			pushContent = leaveObj.MContext;
		} else {
				sfadd="N";
			//点击消息跳转我发起的
//			argu = "{'vid':'generalapprove','pid':'0'}";
//			pushTitle = "你的通用申请:" + leaveObj.Theme;
//			pushContent = approveOpinion;
		}
			var Remark = common.textValiAlert(document.getElementById("Remark").value, "请填写内容");
			if (!Remark) {
				return;
			}
		var txtscore = common.numValiAlert(document.getElementById("txtscore").value, "请填写积分");
			if (!txtscore) {
				return;
			}	
		if(sfadd=="N")txtscore=-txtscore;
		var data = {
			sfadd: sfadd,
			sfkh: sfkh,
			id: id,
			score: txtscore,
			content: Remark,
			uid: getUserInfo().ID
//			hidToUser: '', //负责人
//			hidCcUser: '', //相关人
//			pushTitle: pushTitle,
//			pushContent: pushContent,
//			param: argu
		};
		commitLock = false;
		//common.showWaiting();
		common.postApi('UpdateScore', data, function(response) {
			if (response.data == "success") {
				//currentViewHide();
				common.toast("提交成功");
			plus.webview.currentWebview().reload();
				//var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				//mui.fire(fatherView, 'reloadfun', {});
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}
	//隐藏当前页面

	function currentViewHide() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {});
	}

});