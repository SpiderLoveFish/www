var commitlock = true; //提交锁
var statrCount = 0;
var showCount = 10;
var count = 0;
var list = document.getElementById('list');
var header = document.querySelector('header.mui-bar');
var news_hint = document.getElementsByClassName("news_botton_hint");
var headLetter;
var temHead = '<li data-group="@headLetter" class="mui-table-view-divider mui-indexed-list-group">@headLetter</li>';
//数据体
var temBody = '<li data-tags="@Header" class="mui-table-view-cell mui-indexed-list-item addlist_stafflist"><div data-value="@id" class="divClick"><img src="@titleimg"><div class="addlist_staffname"><div class="addlist_name">@UserName</div><span class="addlist_post">@DepartmentName</span></div></div><div class="addlist_makecall" data-mobile="@Mobilecall"></div><div class="addlist_makemass"  data-mobile="@Mobilemsg"></div></li>';
//获取数据
//还可以加入收藏优先，限制收藏数量比如100个
function GetUserList(selectType, departmentId, searchkey) {

	document.getElementById("UserList").innerHTML = "";
	 document.getElementById("headerList").innerHTML = "";
	//字母头
	var uType = 'ToOrCcUserList';
	if(selectType) {
		uType = selectType;
	}
	var sk = ''
	if(searchkey) {
		sk = searchkey;
	}
	var key = '';
	if(departmentId) {
		key = departmentId;
	}
	var uID = getUserInfo().ID;
	//alert(sk)
	var data = {
		keyword: key,
		ID: uID,
		url: ApiUrl,
		index:50,
		//topnumber: 50,
		searchkey: sk
	};
	//alert(JSON.stringify(data))
	 var db = common.openDatabase();
	if(!common.isNetWork()) {
		//未联网
		 selectTable(db);
	} else {
		common.postApi("GetCustomerList_Page", data, function(response) {
			dataArray = eval(response.data);
			//alert(JSON.stringify(dataArray[0]))
			createTable(db);
			deleteTable(db);
			news_hint[0].style.display = "block";
 				news_hint[0].innerText = dataArray[1].Total;
			for(var i = 0; i < dataArray[0].length; i++) {
				var temp; //临时变量
				var obj = dataArray[0][i];
				var head=obj.header;
				//创建websql 表
				if(headLetter != head) { //没有此头字母,插入头
					headLetter = head;
					//列表右侧字母列表
					document.getElementById("headerList").innerHTML += "<a>" + head + "</a>";
					//主列表字母头
					temp = temHead;
					document.getElementById("UserList").innerHTML += temp.replace("@headLetter", head).replace("@headLetter", head);
				}
				var avatar = obj.Avatar;
				if(avatar == '' || avatar == null || avatar == 'null')
					avatar = '../../images/ScApp/general/headimg/headimg_02.png';
				temp = temBody;
				temp = temp.replace("@id", obj.id);
				temp = temp.replace("@Header", obj.header + obj.Customer + obj.tel + obj.address);
				temp = temp.replace("@Mobilecall", obj.tel);
				temp = temp.replace("@Mobilemsg", obj.id);
				temp = temp.replace("@titleimg", avatar);
				temp = temp.replace("@UserName", obj.Customer);
				temp = temp.replace("@DepartmentName", obj.address);
				document.getElementById("UserList").innerHTML += temp;
				//插入表
				insertTable(db, obj.header, obj.id, obj.tel, obj.id, obj.Customer, obj.address)
			}
			//duangduang();    
 			list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
			window.indexedList = new mui.IndexedList(list);
			mui("#list").indexedList();
			common.closeWaiting();
			//通讯录加载完毕再关闭index页的waiting
			mui("#list").indexedList().findElements();
		}, 'json');
	}
}

//创建websql 表
function createTable(db) {

	db.transaction(function(context) {
		context.executeSql('CREATE TABLE IF NOT EXISTS addListTable (ID INTEGER PRIMARY KEY ASC,Header TEXT,UserId TEXT,Mobile TEXT,Avatar TEXT,UserName TEXT,DepartmentName TEXT)', []);
	}, function(tx, error) {
		//alert('创建addListTable表失败:' + error.message);
	}, function(tx, result) {
		//alert('创建addListTable表成功');
	});
}
//删除 表
function deleteTable(db) {
	db.transaction(function(context) {
		context.executeSql('delete from addListTable');
	});
}

//插入表
function insertTable(db, Header, UserId, Mobile, Avatar, UserName, DepartmentName) {
	db.transaction(function(context) {
		context.executeSql(
			"insert into addListTable (Header, UserId,Mobile,Avatar,UserName,DepartmentName) values(?,?,?,?,?,?)", [Header, UserId, Mobile, Avatar, UserName, DepartmentName]
		);
	});
}

function selectTable(db) {
	db.transaction(function(context) {
		context.executeSql('SELECT * FROM addListTable', [], function(con, results) {
			var len = results.rows.length,
				i;
			for(i = 0; i < len; i++) {
				var obj = results.rows.item(i);
				var temp; //临时变量
				if(headLetter != obj.header) { //没有此头字母,插入头
					headLetter = obj.header;
					//列表右侧字母列表
					document.getElementById("headerList").innerHTML += "<a>" + obj.header + "</a>";
					//主列表字母头
					temp = temHead;
					document.getElementById("UserList").innerHTML += temp.replace("@headLetter", obj.header).replace("@headLetter", obj.header);
				}
				temp = temBody;
				temp = temp.replace("@id", obj.id);
				temp = temp.replace("@Header", obj.header + obj.tel);
				temp = temp.replace("@Mobilecall", obj.tel);
				temp = temp.replace("@Mobilemsg", obj.tel);
				temp = temp.replace("@titleimg", obj.Avatar);
				temp = temp.replace("@UserName", obj.Customer);
				temp = temp.replace("@DepartmentName", obj.address);
				document.getElementById("UserList").innerHTML += temp;
				list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
				window.indexedList = new mui.IndexedList(list);
				mui("#list").indexedList();
				common.closeWaiting();
			}
		}, function(tx, error) {

		});
	});
}

	var search = document.getElementById("search");
mui.plusReady(function() {
	//	list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
	search.style.display="none";
	GetUserList();
	var detailPageId = 'addList_detail.html';
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
	//监听详情页面请求关闭
	window.addEventListener('reloadfun', function() {
		GetUserList();
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
	//短信
	function smsTest(mobile, message) {
		var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		msg.to = [mobile];
		msg.body = message;
		plus.messaging.sendMessage(msg);
	}

	//添加列表项的点击事件
	mui('#UserList').on('tap', '.divClick', function(e) {
		//移除焦点,为了隐藏软键盘
		//search.blur();
		if(!detailPage) {
			detailPage.setStyle({
				left: '100%',
				zindex: 9999
			});
		}
		var id = this.getAttribute('data-value');
		detailPage.loadURL('addList_detail.html?id=' + id);
		openMenu();
	});
 
	mui('#UserList').on('tap', '.addlist_makecall', function(e) {
		//移除焦点,为了隐藏软键盘
		//search.blur();//
		var href = this.getAttribute('data-mobile');
		plus.device.dial(href);

	});
	mui('#UserList').on('tap', '.addlist_makemass', function(e) {
		//移除焦点,为了隐藏软键盘
		//search.blur();
		var msg = "";
		var href = this.getAttribute('data-mobile');
		//smsTest(href, msg);
		//	document.getElementById("sendMessage").addEventListener('tap', function() {
		//		currentWebViewHide();

		var template = common.getTemplate('addfollow_list', 'addfollow.html?id=' + href);
		//	});
	});
  
	/***********************************部门侧滑start*****************************************/

	var maskDepartment = mui.createMask(_closeMenuDepartment);
	var departmentPage = null;
	var departmentId = 'department.html';
	mui('.mui-bar-nav').on("tap", '#icon-menu', function(e) {
		//移除焦点,为了隐藏软键盘
		//document.getElementById("search").blur();
		if(!departmentPage) {
			departmentPage = plus.webview.getWebviewById(departmentId);
			departmentPage.setStyle({
				right: '100%',
				zindex: 9999
			});
		}
		openMenuDepartment();
	});
	mui.plusReady(function() {
		//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
		setTimeout(function() {
			mui.preload({
				id: departmentId,
				url: 'department.html',
				styles: {
					right: "20%",
					width: '80%',
					zindex: 9997
				}
			});
		}, 150);
		 
		//监听部门页面请求关闭
		window.addEventListener('hidedepartmentPage', function(event) {
			_closeMenuDepartment();
			maskDepartment.close();
			id = event.detail.id;
			// alert(id)
			GetUserList("search", 'search', id);
//			if(id) {
//				if(id == "all") {
//					GetUserList();
//				} else if(id == "fav") {
//					GetUserList('', 'fav', '');
//				} else {
//					GetUserList("GetUserListByDepartment", id);
//				}
//
//			}
		});
 		mui('.mui-bar-nav').on('tap', '.btn_post_activ', function(e) {
		 common.Verifauthority(r_add_custmoer, function(result) { //生日
				 	if(result)
				var template = common.getTemplate('add_custmer_apply', 'activity_apply.html?');
					});//新闻发布权限
		
	});

	});
	/*
	 * 显示菜单菜单
	 */
	function openMenuDepartment() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		departmentPage.show('none', 0, function() {
			departmentPage.setStyle({
				right: '20%',
				transition: {
					duration: 150
				}
			});
		});
		maskDepartment.show(); //遮罩
	}
	/**
	 * 关闭侧滑菜单(业务部分)
	 */
	function _closeMenuDepartment() {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}
		//主窗体开始侧滑；
		departmentPage.setStyle({
			right: '100%',
			transition: {
				duration: 100
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			departmentPage.hide();
		}, 100);
	}
	/***********************************部门侧滑end*****************************************/

});