mui.plusReady(function() {
 var sj="[{id:'08:00-10:00',text:'08:00-10:00'},{id:'10:00-12:00',text:'10:00-12:00'},{id:'14:00-16:00',text:'14:00-16:00'},{id:'16:00-18:00',text:'16:00-18:00'}]";
 var sfkh="[{id:'是',text:'是'},{id:'否',text:'否'}]";
	//获取日期
	var startDate, startTime, endDate, endTime, overDate, overTime;
var khbh='';
	var pickDateBtn = document.getElementById("pickDateBtn");
	pickDateBtn.addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			overDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			$('#pickDateBtn').text(overDate);
//			startTimeChoose(function(time) {
//				overTime = time;
//				$('#pickDateBtn').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + overTime);
			//});
		}, function(e) {

		}, {
			title: "日期"
		});
	});
//维修类型
	combGetComboxType(12,document.getElementById('wxlb'));	
	combGetCombox(document.getElementById('wxsj'),sj);
	combGetCombox(document.getElementById('sfkh'),sfkh);
	////////////////////////


//
//
//	var pickStart = document.getElementById("starDate");
//	pickStart.addEventListener('tap', function() {
//		plus.nativeUI.pickDate(function(e) {
//			//开始日期
//			var d = e.date;
//			startDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
//			//开始时间
//			startTimeChoose(function(time) {
//				startTime = time;
//				$('#starDate').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + startTime);
//			});
//		}, function(e) {
//
//		}, {
//			title: "开始日期"
//		});
//	});
//	var pickEnd = document.getElementById("endDate");
//	pickEnd.addEventListener('tap', function() {
//		plus.nativeUI.pickDate(function(e) {
//			//开始日期
//			var d = e.date;
//			endDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
//			//截止时间
//			endTimeChoose(function(time) {
//				endTime = time;
//				$('#endDate').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + endTime);
//			});
//		}, function(e) {
//
//		}, {
//			title: "结束日期"
//		});
//	});
//
	function startTimeChoose(success) {
		var dTime = new Date();
		dTime.setHours(9, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			//成功回调
			success(d.getHours() + ":" + minute);
		}, function(e) {
			//pickTimeBtn.innerText = "请选择时间"
		}, {
			title: "开始时间",
			is24Hour: true,
			time: dTime
		});
	}
//
//	//截止时间选择
//	function endTimeChoose(success) {
//		var dTime = new Date();
//		dTime.setHours(18, 0);
//		plus.nativeUI.pickTime(function(e) {
//			var d = e.date;
//			var minute;
//			if (d.getMinutes() < 10) {
//				minute = "0" + d.getMinutes();
//			} else {
//				minute = d.getMinutes();
//			}
//			success(d.getHours() + ":" + minute);
//		}, function(e) {
//			//pickTimeBtnEnd.innerText = "请选择时间"
//		}, {
//			title: "结束时间",
//			is24Hour: true,
//			time: dTime
//		});
//	}

	//***********************处理开关事件*****************************************
//	var IsHost = '0';
//	mui('.mui-content .mui-switch').each(function() { //循环所有toggle
//		/**
//		 * toggle 事件监听
//		 */
//		this.addEventListener('toggle', function(event) {
//			//保存选中状态
//			if (event.detail.isActive) {
//				IsHost = '1';
//			} else {
//				IsHost = '0';
//			}
//		});
//	});
	//***********************处理开关事件结束*****************************************
	 //上一步
	 common.click("btnpre", function() {
	 			
	 	$('#next').hide();//隐藏div
	 	$('#first').show();//显示div
	});
	//下一步
		 common.click("btnnext", function() {
		 	var endDateHtml = document.getElementById("telTitle").value;
		if (endDateHtml == "") {
			alert("请填写电话号码");
			return;
		}
		 	
		 	var data = {
			tel: document.getElementById("telTitle").value 
			};
				//alert(JSON.stringify(data))
		 	common.postApi('GetCustomerDetail_tel', data, function(response) {
		 		//alert(JSON.stringify(response.data))
				dataArray = eval(response.data);
				for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			khbh=obj.id;
			document.getElementById("xm").value = obj.tel+'/'+obj.Customer; 
			document.getElementById("dz").value = obj.address;  
			}
				common.closeWaiting();
			}, 'json');
		 	$('#next').show();//显示div
	 	 $('#first').hide();//隐藏div
	});
	
	var commitLock = true;
	common.click("btnSubmit", function() {
		if (!commitLock) {
			return;
		}
		 if(!khbh)
		 	return;
		var AContextType = common.textValiAlert(document.getElementById("AContext").value, "请填写维修内容");
		if (!AContextType) {
			return;
		}
 
		var pickDateBtnHtml = document.getElementById("pickDateBtn").innerHTML;
		if (pickDateBtnHtml == "请选择") {
			alert("请填写时间");
			return;
		}
 		var selectwxsj=document.getElementById("wxsj");  
			var sj=selectwxsj.options[selectwxsj.selectedIndex].value;//时间
	 
	 var selectwxlb=document.getElementById("wxlb");  
			var wxlb=selectwxlb.options[selectwxlb.selectedIndex].value;//维修类别
			
	  var selectsfkh=document.getElementById("sfkh");  
			var sfkh=selectsfkh.options[selectsfkh.selectedIndex].value;//是否客户
	
	 var khmc=document.getElementById("xm").value;
	 var tel=document.getElementById("telTitle").value;
	 var address =document.getElementById("dz").value;
	 
	 var data = {
			 khbh:khbh,
			 wxlbid:wxlb,
			 wxyy:AContextType,
			 sfkh:sfkh,
			 wxrq:pickDateBtnHtml,
			 wxsj:sj,
			 userid:getUserInfo().ID,
			 khmc:khmc,
			 tel:tel,
			 address:address
		};
		commitLock = false;
		//common.showWaiting();
//		alert(JSON.stringify(data))
		common.postApi("AddCRM_Repair", data, function(response) {
			// alert(JSON.stringify(response.data))
			if (response.data == "success") {
				mui.toast("提交成功!!!");
				go();
			} else {
				mui.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	});

	function go() {
		document.getElementById("telTitle").innerText="";
			$('#next').hide();//隐藏div
	 	$('#first').show();//显示div
//		var listWebview = plus.webview.currentWebview();
//		listWebview.loadURL('../news/activity_list.html');
	}
   //获取COMBOX第1种
    function combGetCombox(dgid,data)
     {
   	  var 	dataArray = eval(data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				dgid.options.add(new Option(obj.text, obj.id));
			}
	 
			common.closeWaiting();
     }
  //获取COMBOX第二种
         function combGetComboxType(type,dgid)
     {
     	 common.postApi("GetComboxType", {
			'parentid': type
		}, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray))
			for(var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				dgid.options.add(new Option(obj.params_name, obj.id));
			}
	 
			common.closeWaiting();
		}, 'json');
     	
     }
//--------------------------------------------------------------------------
	common.backOfHideCurrentWebview();
});