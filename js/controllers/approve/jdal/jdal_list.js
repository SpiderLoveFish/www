var list = document.getElementById("list");
var starIndex =10;
var str='';
var type = common.getQueryString('type');
function getpullupRefresh() {
	setTimeout(function() {
		getActivityList();
	}, 500);
}


	function fillGoodsLI(e) {
			var hostimg = '../../images/ScApp/news/mr.jpg';
			// alert(obj.IsHostPic)
			if(e.thumimg == '' || e.thumimg == 'null' || e.thumimg == null) {} else
				hostimg =e.thumimg;
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
				j.setAttribute("data-value", e.viewurl);
				g.setAttribute("class", "mui-media-object");
				g.src = hostimg;//"images/loading.gif";
				g.setAttribute('data-delay', hostimg);
				c.innerHTML = e.c_title+e.customer_name;
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
	//var html = '<a id="@id" data-img=@IsHostPic class="sc_cell sc_padding mui-table-view-cell">' + '<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' + '<div class="sc_cell_bd sc_cell_primary">' + '<p>@Title</p>' + '<p class="label_describe_2">@Description</p>' + '<span class="sc_comment">@ReleaseDateTime</span>' + '</div>' + '<div class="sc_cell_data">@flag</div></a>';
	var html='<li><a><i><em><img><p></p></img></em></i></a></li>';
		var data = {
		strwhere: str,//str
		type:type,
		nowindex:  starIndex,
		url:ApiUrl
	};
	common.postApi('GetLastListClassicCase', data, function(response) {
		c = document.createDocumentFragment();
		dataArray = eval(response.data);
		//alert(JSON.stringify(dataArray))
		 if(starIndex==10||dataArray.length)
		list.innerHTML ='';
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];			
				c.appendChild(fillGoodsLI(obj))
					list.appendChild(c);
//				var hostimg='../../images/ScApp/news/mr.jpg';
//				 // alert(obj.IsHostPic)
//				if(obj.thumimg==''||obj.thumimg=='null'||obj.thumimg==null)	{}
//				else
//				 hostimg=obj.thumimg;
//				 
//				var itemhtml = html.replace('@id', obj.ID).replace('@Title', (obj.c_title)).replace('@Description',obj.customer_name).replace('@IsHostPic', hostimg);
//				 
//				 
//				list.innerHTML += itemhtml.replace('@IsHostPic', hostimg);
 
		}
		starIndex = starIndex + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
	 
	}, 'json');
}
//添加上一个页面自定义事件监听
            window.addEventListener('DIY_DATA', function(event) {               
                str = event.detail.strwhere;
                type= event.detail.type;
               // alert(str);
               starIndex=10;
                getActivityList();
            }); 
   
  
   
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
		var viewurl = this.getAttribute('data-value');
	//var webview = common.getTemplate('showjdal',"show.html?img="+id);
	mui.openWindow({
			url: 'show.html',
			id: 'showjdal',
			extras: {
				ID: id,
				url:viewurl
			}
		});
	});
	
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
	;
	
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