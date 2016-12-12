var list = document.getElementById("list"); 
var starIndex = 10;
function getpullupRefresh() {
	//alert(11)
	setTimeout(function() {
		getActivityList();
	}, 500);
}

function getActivityList() {
// alert(1)
	var htmlhead = '	<div class="lobster-v2-product-list">' ;
	var html ='<div class="lobster-v2-product-item" data-id=@pid>'
	+'<div class="lobster-v2-product-cover lobster-cart-selected">'
	+'<div style="color: #fff; margin: 5px;">@pname</div>'
	+'<div style="position: absolute;top:36%; color: #fff;text-align: right;width: 100%;font-family: arial; right: 10px;">'
	+'<span style="font-size: 2em;">x </span><span class="lobster-v2-product-price" id="arrData" style="font-size: 5em;">0</span>'
	+'<div></div><div>'
	+'<img src=@flagpic style="position: absolute;width: 70px;top: 0;right: 0">'
	+'<img class="product-img" src=@hrefUrl" data-id=@pid data-stopStatus=@stopStatus data-quantity=@quantity/>'
	+'</div><div class="lobster-v2-product-description">';
	var stop1='<div style="position: absolute; right: 10px; top: 20px;color: #FF3F3F;">今日估清</div>';
	var stop0='<img class="lobster-v2-minus lobster-cart-selected" data-id=@pid src="image/minus.png" />'
						+'<div class="lobster-cart-selected" data-id=@pid style="border: 0.5px solid #959595; position: absolute; height: 50px; bottom: 8px; z-index: 300; right: 55px;"></div>'
						+'<img class="lobster-v2-plus" data-id=@pid src="image/plus.png" />'
//	<%if (products[i].stopStatus ==2) {%>
//						<%if (products[i].quantity <=0) {%>
	var stop2='<div style="position: absolute; right: 10px; top: 20px;color: #FF3F3F;">暂时无货</div>';
	
	var stop3 ='<img class="lobster-v2-minus lobster-cart-selected" data-id=@pid src="image/minus.png" />'
						+'<div class="lobster-cart-selected" data-id=@pid style="border: 0.5px solid #959595; position: absolute; height: 50px; bottom: 8px; z-index: 300; right: 55px;"></div>'
						+'<img class="lobster-v2-plus" data-id=@pid src="image/plus.png" />';
		var html2='<div style="font-family: yuanti sans-serif ; font-size: 14px;">';
		+'@pname</div><div style="font-size: 12px;color: #aaa;">'
		+'@description</div><div style="line-height: 12px;">'
		+'	<span style="font-family: number sans-serif;font-size: 12px; color:#aaa;text-decoration: line-through;">￥@promotionPrice</span>'
		+'	<span style="font-family: number sans-serif;font-size: 13px; color:rgba(255, 63, 63, 0.94)" class="danjia">￥@price</span>'
		+'</div></div></div>'
		var htmlend='</div>';
	var data = {
		strwhere: '',
		nowindex:  starIndex,
		url:ApiUrl
	};
	//alert(JSON.stringify(data))
	common.postApi('GetLastListScoreShop', data, function(response) {
		
	var dataArray= eval(response.data);
		 
		for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
			var itemhtml='';
			if (i % 2 == 0)
			 {
			 	itemhtml+=htmlhead;
			 }
			 	 itemhtml+=html.replace('@pid', obj.n).replace('@pname', obj.c_title).replace('@flagpic', obj.thumimg).replace('@quantity', obj.img_style);
			 	 //.replace('@hrefUrl', obj.thumimg)
			     if(obj.IsStatus==1)//状态1今日估清
			     itemhtml+=stop2;
			      if(obj.IsStatus==0)//状态0
			       itemhtml+=stop0.replace('@pid', obj.n);
			         if(obj.IsStatus==2)//状态2
			         {
			         	if(obj.img_style<=0)//数量小于0暂时无货
			       			itemhtml+=stop2;
			       			else
			       			itemhtml+=stop3.replace('@pid', obj.n);
			       }
			     itemhtml+=html2.replace('@pname', obj.c_title).replace('@description', obj.customer_name).replace('@promotionPrice', obj.img_style).replace('@price', obj.n);    
			if (i % 2 == 1)
			 itemhtml+=htmlend;
				list.innerHTML += itemhtml;
			} 
		//	alert(list.innerHTML)
		//console.log(list.innerHTML)
		starIndex = starIndex + 10;
		//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
 
	}, 'json');
}
$(function() {
	 
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
				mui('#pullrefresh').pullRefresh().refresh(true);
			}, 50);
		 
})
mui.plusReady(function() {
//	mui('.container').on('tap', 'a', function(e) {
//		var id = this.getAttribute('id');
//		var score= this.getAttribute('name');
//		var template = common.getTemplate('jfdetail', 'activity_detail.html?id=' + id+'&sfkh='+sfkh+'&score='+score);
//
//	});
//	mui('.mui-bar-nav').on('tap', '.btn_post_activ', function(e) {
//		var template = common.getTemplate('jfapp', 'activity_apply.html?');
//	});

	if (plus.os.name != "Android") {
		var pullrefreshAll = document.getElementById("pullrefresh");
			pullrefreshAll.style.marginTop = CommonTop;
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
 

	});
	//返回
	common.backOfHideCurrentWebview(function() {
		//common.initMessage();
	});
});