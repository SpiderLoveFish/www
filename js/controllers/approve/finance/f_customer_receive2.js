mui.init();
var commitLock = true;
var id; //主鍵
var strwhere='';
var approveOpinion = ''; //审批意见
var status; //审批结果状态
var leaveObj;
function getlist(type,strwhere)
{
	
	var jsn = {
		type:type,
		strwhere:strwhere
	};
	console.log(JSON.stringify(jsn))
	common.postApi('GetFinance', jsn, function(response) {
		var data = eval(response.data);
	 
		//业务数据
		console.log(JSON.stringify(data))
	 
		var item = "";
		var cn = "";
		var sum = 0;
		// $.each(objs, function (i, data) {
			$('#list tbody').html("");
		for(var i = 0; i < data.length; i++) {
			 
		if(data[i]['community'] == '合计') {
			var rq=new Date().Format("yyyy-MM");
			
				if(strwhere.length>3)
					{	rq=strwhere.split(';')[8]
				rq=rq.substring(0,rq.length-3)
					}
					item = "<tr height=40px><th>" + data[i]['customer']+ "</th>"
				                        +"<th class='text-center' >[" + rq  + "]</th>"+
					"<th  class='text-primary text-right'>" + data[i]['ys'].toFixed(0) + "</th><th class='text-success text-right'>" +  data[i]['dj'].toFixed(0)+ "</th> " +
					" <th  class='text-success text-right'>" + data[i]['zxk'].toFixed(0) + "</th><th  class='text-danger text-right'>" + data[i]['wsk'].toFixed(0) + "</th> " 					 
					" </tr>";
			} else {
					item = "<tr height=40px><th><a class='sc' id='" + data[i]['customer_id'] + "'>" + data[i]['customer'] + "</a></th>"
				                        +"<th class='text-center' >" + data[i]['tel'] + "</th>"+
					"<th  class='text-primary text-right'>" + data[i]['ys'].toFixed(0) + "</th><th class='text-success text-right'>" +  data[i]['dj'].toFixed(0)+ "</th> " +
					" <th  class='text-success text-right'>" + data[i]['zxk'].toFixed(0) + "</th><th  class='text-danger text-right'>" + data[i]['wsk'].toFixed(0) + "</th> " 					 
					" </tr>";
//				item = "<tr><td><a class='sc' id='" + data[i]['Community_id'] + "'>" + data[i]['community'] + "</a></td>"
//					//                         +"<td align='right'>" + data[i]['zc_price'] + "</td><td align='right'>" + data[i]['fc_price'] + "</td><td align='right'>" + data[i]['rg_price']  + "</td>"
//					+
//					"<td align='left'>" + data[i]['sl'] + "</td><td align='left'>" + data[i]['ys'] + "</td><td align='left'>" +  data[i]['dj']+ "</td> " +
//					" <td align='left'>" + data[i]['zxk'] + "</td><td align='left'>" + data[i]['wsk'] + "</td> " 					 
//					" </tr>";
			}
			$('.table1 tbody').append(item);
			// alert(item)
			//cn = data[i]['ComponentName'];
		}

		  
	
		common.closeWaiting();
	}, 'json');
}

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
	
 	getlist( 'SZHZ','|');

	var detailPage = null;
	mui('#list').on('tap', '.sc', function(e) {
		//移除焦点,为了隐藏软键盘		 
		var id = this.getAttribute('id');
				var template = common.getTemplate('f_customer_detail2', 'f_customer_detail.html?id=' + id);

			//var template = common.getTemplate('f_customer_receive', 'f_customer_receive_detail.html?id=' + id+'&strwhere='+encodeURI(encodeURI(strwhere)));
//		if(!detailPage) {
//			detailPage.setStyle({
//				left: '100%',
//				zindex: 9999
//			});
//		}
		//var id = this.getAttribute('data-value');
		//detailPage.loadURL('../../finance/f_customer_receive_detail.html?id=' + id);
		//openMenu();
	});

	var detailPageId = '../../approve/finance/searchfinance2.html';
	var detailPage = null;
	var mask = mui.createMask(_closeMenu);
		mui('.mui-bar-nav').on("tap", '#icon-menu', function(e) {
			var id = this.getAttribute('id');
				if(!detailPage) {
			detailPage.setStyle({
				left: '100%',
				zindex: 9999
			});
		}
		detailPage.loadURL('../../approve/finance/searchfinance2.html');	
		openMenu();
		});
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		detailPage = common.getWebviewDetailById(detailPageId);
	}, 150);
	//监听详情页面请求关闭
	window.addEventListener('hideDetailPage', function() {
		_closeMenu();
		mask.close();
	var	id = event.detail.id;
	strwhere=id;
			getlist( 'SZHZ','|'+id);
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
// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}
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
	
	//隐藏当前页面

	function currentViewHide() {
	//alert(2)
	     plus.webview.currentWebview().back();
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {});
	}

});