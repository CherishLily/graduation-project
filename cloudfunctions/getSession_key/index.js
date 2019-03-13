// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');
const crypto = require('crypto');

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const { code, nickName, gender, avatarUrl } = event;
	const secret = 'd5fe38fcc7c6dfd640d9bba2276723d6';
	const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxContext.APPID}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
	//发请求获取session_key和openid
	const requestSync = async (url) => {
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				if(err){
					reject(err);
				}else{
					resolve(body);
				}
			})
		})
	};

	// 使用crypto模块加密生成自己的登录态标识skey
	const encryptSha1 = (data) => crypto.createHash('sha1').update(data, 'utf8').digest('hex');

	//获取session_key和openid
	let res = await requestSync(url);
	res = JSON.parse(res);
	const { session_key, openid } = res;
	const skey = encryptSha1(session_key); // 加密session_key获得skey
	
	const detailInfo = {
			nickName,
			gender,
			avatarUrl,
			autograph: '',
			dormitoryArea: '',
			weChat:'',
			phoneNumber: ''
		};
	//存入数据库
	const params = {
		openid,
		session_key,
		skey,
		detailInfo,
	};

	try {
		const oldData = await db.collection('userInfo').where({
    		openid: openid
    	}).get();
    	if(oldData.data.length) {
    		//如果有旧数据，则更新其session_key和skey
    		await db.collection('userInfo').doc(oldData.data[0]._id).update({
				data: {
					skey,
					session_key
				}
			})
    	} else {
    		//如果没有旧纪录，则添加一条
    		await db.collection('userInfo').add({
	     		data:params
	    	})
    	}
	} catch (e) {
	    console.log(e)
	}

	return {
		skey,
		session_key,
		openid
	};
}