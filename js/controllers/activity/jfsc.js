var list = document.getElementById("list");
var starIndex = 10;

function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}
		function fillGoodsLI(e) {
			var hostimg = '../../images/ScApp/news/mr.jpg';
			// alert(obj.IsHostPic)
			if(e.img == '' || e.img == 'null' || e.img == null) {} else
				hostimg = ApiUrl + e.img;
				var k = document,
					l = k.createElement("li"),
					j = k.createElement("a"),
					f = k.createElement("i"),
					d = k.createElement("em"),
					g = k.createElement("img"),
					c = k.createElement("p"),
					h = k.createElement("b"),
					m = k.createElement("del");
				j.setAttribute("eid", e.ID);
				j.setAttribute("data-img", hostimg);
				g.setAttribute("class", "mui-media-object");
				g.src = hostimg;//"images/loading.gif";
				g.setAttribute('data-delay', hostimg);
				c.innerHTML = e.ScoreName+e.ScoreDescribe;
				h.innerHTML = e.NeedScore;
				m.innerHTML = e.NeedScore;
				h.appendChild(m);
				d.appendChild(g);
				f.appendChild(d);
				j.appendChild(f);
				j.appendChild(c);
				j.appendChild(h);
				l.appendChild(j);
				return l
			}
		
function getActivityList() {
	//var html = '<a id="@id" data-img=@IsHostPic class="sc_cell sc_padding mui-table-view-cell">' + '<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic" data-delay="@IsHostPic" class="mui-media-object"></div>' + '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe_2">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
	var html='<li><a><i><em><img><p></p></img></em></i></a></li>';
	//	var data = {
	//		ID: '',
	//		type: selecttype,
	//		strWhere: '',
	//		starIndex: starIndex,
	//		endIndex: endIndex,
	//};
	var data = {
		strwhere: '',
		nowindex: starIndex,
		url: ApiUrl
	};
	common.postApi('GetLastListScoreShop', data, function(response) {
					c = document.createDocumentFragment();
					
		dataArray = eval(response.data);
		//alert(JSON.stringify(response))
		for(var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			//if (selecttype == "getActivityList_All") {
					c.appendChild(fillGoodsLI(obj))
					list.appendChild(c);
					//delayimg.render();
//			var itemhtml = html.replace('@id', obj.ID).replace('@Title', (obj.ScoreName)).replace('@Description', obj.ScoreDescribe).replace('@ReleaseDateTime', ChangeDateFormat(obj.DoTime)).replace('@IsHostPic', hostimg).replace('@flag', obj.NeedScore);;
//
//			list.innerHTML += itemhtml.replace('@IsHostPic', hostimg);

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

	mui('#list').on('tap', 'a', function(e) {
		var id = this.getAttribute('data-img');
		//var webview = common.getTemplate('showjdal',"show.html?img="+id);
		mui.openWindow({
			url: 'show.html',
			id: 'showjdal',
			extras: {
				ID: id
			}
		});
	});

	if(plus.os.name != "Android") {
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