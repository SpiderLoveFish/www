var list = document.getElementById("list");
var starIndex =10;
 
function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}

function getActivityList() {
	var html = '<a id="@id" class="sc_cell sc_padding mui-table-view-cell">' + '<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' + '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe_2">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
//	var data = {
//		ID: '',
//		type: selecttype,
//		strWhere: '',
//		starIndex: starIndex,
//		endIndex: endIndex,
	//};
		var data = {
		strwhere: '',
		nowindex:  starIndex,
		url:ApiUrl
	};
	common.postApi('GetLastListScoreShop', data, function(response) {
	
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (selecttype == "getActivityList_All") {
				 
				var hostimg='../../images/ScApp/news/mr.jpg';
				 // alert(obj.IsHostPic)
				if(obj.img==''||obj.img=='null'||obj.img==null)	{}
				else
				 hostimg=ApiUrl+obj.img;
				 
				var itemhtml = html.replace('@id', obj.ID).replace('@Title', (obj.ScoreName)).replace('@Description',obj.ScoreDescribe).replace('@ReleaseDateTime',  ChangeDateFormat(obj.DoTime)).replace('@IsHostPic', hostimg).replace('@flag', obj.NeedScore);;
				 
				 
				list.innerHTML += itemhtml;
 
		}
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
	 
	}, 'json');
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


$(function() {
	 
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
				mui('#pullrefresh').pullRefresh().refresh(true);
			}, 50);
		 
})
mui.plusReady(function() {
	 

	if (plus.os.name != "Android") {
		var pullrefreshAll = document.getElementById("pullrefresh");
		//pullrefreshAll.style.marginTop = CommonTop;
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

//		if (selecttype == "getActivityList_NoRead") {
//			list.innerHTML = "";
//			starIndex = 0;
//			endIndex = 1000;
//			getActivityList();
//		}

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		common.initMessage();
	});
});