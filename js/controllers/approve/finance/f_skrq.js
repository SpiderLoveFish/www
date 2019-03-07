var list = document.getElementById("list");
var starIndex = 10;
var endIndex = 1000;
var selecttype = common.getQueryString("selecttype");
var status = "999";

var html_CanYu = '<a href="javascript:;"  class="sc_cell sc_padding mui-table-view-cell" id="@ID">' +
	//	'		<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
	'		<div class="sc_cell_bd sc_cell_primary">' +
	'			<p>【@skkh】@dz</p>' +
	'			<p class="label_describe_2">金额￥：@flag</p>' +
	'			<span class="sc_comment"></span>' +
	'			<span class="sc_comment">@SContext-@ReleaseTime</span>' +
	'		</div>' +
	'		<div class="sc_cell_data">' +
	'			<p></br></p>' +
	'		</div>' +
	
	'	</a>';

function getpullupRefresh() {
	setTimeout(function() {
		getquestionnairelist();
	}, 500);
}

function ChangeDateFormat(jsondate) {
	jsondate = jsondate.replace("/Date(", "").replace(")/", "");
	if(jsondate.indexOf("+") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("+"));
	} else if(jsondate.indexOf("-") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("-"));
	}

	var date = new Date(parseInt(jsondate, 10));
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

	return date.getFullYear() +
		"年" +
		month +
		"月" +
		currentDate +
		"日";
	//  + " "
	//  + date.getHours()
	//  + ":"
	//  + date.getMinutes();
}
var search = document.getElementById("search");
document.getElementById('search').addEventListener('input', function() {
	list.innerHTML = "";
	starIndex=10;
	getquestionnairelist();
	}, false);

function getquestionnairelist() {
	// selecttype = common.getQueryString("selecttype");	
	if(selecttype == "cgdsh") status = 1;
	else if(selecttype == "cgdqr") status = 2;
	var data = { 
		nowindex: starIndex, 
		strWhere: search.value//' and isNode=' + status + '',  
	};
	//alert(JSON.stringify(data))
	common.postApi('GetCRM_receive', data, function(response) {
		dataArray = eval(response.data);
		//alert(JSON.stringify(response.data))
		for(var i = 0; i < dataArray.length; i++) {
		 
			var obj = dataArray[i];
			// alert(JSON.stringify(obj))
			//if (obj.DoPerson == getUserInfo().ID) {
			list.innerHTML += html_CanYu.replace('@ID', obj.id).replace('@skkh', obj.Customer).replace('@dz', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.create_date)).replace('@SContext',obj.create_name).replace('@flag', obj.receive_real).replace('@remarks',myHTMLDeCode(obj.remarks));
			//			} else {
			//				list.innerHTML += html_No.replace('@IsHostPic', obj.IsHostPic).replace('@ID', obj.id).replace('@STheme', obj.BudgetName).replace('@SContext', substringAddPoint(obj.address, 15)).replace('@ReleaseTime', ChangeDateFormat(obj.DoTime));
			//			}
		}
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了

	}, 'json');
}
var detailPage = null;
mui.plusReady(function() {
	mui('#list').on('tap', '.sc_cell', function(e) {
		var id = this.getAttribute('id');
		var type = common.getQueryString("selecttype");
		//var webview = common.getTemplate('page1');
		var template = common.getTemplate('f_skrqdetail', 'f_skqrdetail.html?id=' + id );
		//		webview.loadURL('ysdetail.html?id=' + id+'&selecttype='+type);
	});
	if(plus.os.name != "Android") {
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
	if(mui.os.plus) {
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

	window.addEventListener('refresh1', function(e) {
		//alert( e.detail.type);
		selecttype = e.detail.type;
		starIndex = 10;
		list.innerHTML = "";
		getquestionnairelist();

	});

});