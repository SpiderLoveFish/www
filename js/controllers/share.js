var shares=null;
// H5 plus事件处理
function plusReady(){
	updateSerivces();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready', plusReady, false);
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices(function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		outSet('获取分享服务列表失败：'+e.message);
	});
}
/**
   * 发送分享消息
   * @param {JSON} msg
   * @param {plus.share.ShareService} s
   */
function shareMessage(msg, s){
	console.log(JSON.stringify(msg));
	s.send(msg, function(){
		console.log('分享到"'+s.description+'"成功！');
	}, function(e){
		console.log('分享到"'+s.description+'"失败: '+JSON.stringify(e));
	});
}
/**
   * 分享操作
   * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
   * @param {Boolean} bh 是否分享链接
   */
function shareAction(sb,bh,sharecontent,sharehref,sharehrefTitle,sharehrefDes,PicrealUrl) {
	 console.log('分享操作：');
	if(!sb||!sb.s){
		 console.log('无效的分享服务！');
		return;
	}
	//console.log(sharecontent.value)
	var msg={content:sharecontent,extra:{scene:sb.x}};
	if(bh){
		//console.log(sharehref.value)
		msg.href=sharehref;
		//console.log(sharehrefTitle.value)
		if(sharehrefTitle&&sharehrefTitle!=''){
			msg.title=sharehrefTitle;
		}
		//console.log(sharehrefDes.value)
		if(sharehrefDes&&sharehrefDes!=''){
			msg.content=sharehrefDes;
		}
		msg.thumbs=['_www/logo.png'];
		msg.pictures=['_www/logo.png'];
	}else{
//		if(pic&&pic.realUrl){
//			msg.pictures=[pic.realUrl];
//		}
	}
	// 发送分享
	if(sb.s.authenticated){
		 console.log('---已授权---');
		shareMessage(msg, sb.s);
	}else{
		 console.log('---未授权---');
		sb.s.authorize(function(){
			shareMessage(msg,sb.s);
		}, function(e){
			 console.log('认证授权失败：'+e.code+' - '+e.message);
		});
	}
}
// 打开分享
function shareShow(sharecontent,sharehref,sharehrefTitle,sharehrefDes,PicrealUrl){
	var shareBts=[];
	// 更新分享列表
	var ss=shares['weixin'];
	if(navigator.userAgent.indexOf('qihoo')<0){  //在360流应用中微信不支持分享图片
		ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
		shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
	}
//	ss=shares['sinaweibo'];
//	ss&&shareBts.push({title:'新浪微博',s:ss});
//	ss=shares['qq'];
//	ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
	// 弹出分享列表
	shareBts.length>0?plus.nativeUI.actionSheet({title:'分享',cancel:'取消',buttons:shareBts}, function(e){
		(e.index>0)&&shareAction(shareBts[e.index-1],false
		,sharecontent,sharehref,sharehrefTitle,sharehrefDes,PicrealUrl);
	}):plus.nativeUI.alert('当前环境无法支持分享操作!');
}
// 分析链接
function shareHref(sharecontent,sharehref,sharehrefTitle,sharehrefDes,PicrealUrl){
	var shareBts=[];
	// 更新分享列表
	var ss=shares['weixin'];
	ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
	shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
//	ss=shares['qq'];
//	ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
	// 弹出分享列表
	shareBts.length>0?plus.nativeUI.actionSheet({title:'分享链接',cancel:'取消',buttons:shareBts},function(e){
		(e.index>0)&&shareAction(shareBts[e.index-1],true
		,sharecontent,sharehref,sharehrefTitle,sharehrefDes,PicrealUrl);
	}):plus.nativeUI.alert('当前环境无法支持分享链接操作!');
}
