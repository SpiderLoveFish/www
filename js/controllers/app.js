(function($, owner) {
	owner.login = function(loginname, pwd, clientid,version, callback) {
//		
//		var data={
//				url:ApiUrl,
//				user: loginname,
//				pwd: pwd,
//				ClientId: clientid
//				,version:version
//		};
//		alert(JSON.stringify(data))
			common.postApi("UpdateUserClientId", {
				url:ApiUrl,
				user: loginname,
				pwd: pwd,
				ClientId: clientid
				,version:version
			}, function(response) {
	//alert(JSON.stringify(response))
				if (response.data.length > 0) {
					for (var i = 0; i < response.data.length; i++) {
						var obj = response.data[i];
						var userinfo = new Object();
						userinfo.ID = obj.ID;
						userinfo.token = obj.token; //
						userinfo.UserId = obj.UserId;// token
						userinfo.CorpId = obj.CorpId;
						userinfo.ClientId = clientid;
						userinfo.UserName = obj.UserName;
						userinfo.Avatar = obj.Avatar;
						userinfo.Level = obj.level;
					    userinfo.VerTime = obj.vertime;
						owner.setUserInfo(userinfo);
					}
					callback(true);
				} else {
					callback(false);
				}


			}, 'json');
		}
		//设置本地用户信息
	owner.setUserInfo = function(userInfo) {
			localStorage.setItem('$users', JSON.stringify(userInfo));
		}
		//获取本地用户信息
	owner.getUserInfo = function() {
			return JSON.parse(localStorage.getItem('$users') || '[]');
		}
		/**
		 * 获取应用本地配置
		 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}

}(mui, window.app = {}));