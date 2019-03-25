//获取个人详细信息
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey } = event;
	const result = await db.collection('userInfo').where({
    		skey: skey
    	}).get();
	let res = {};
	const g_map = {
		1: '男',
		2: '女'
	};
	const gender = g_map[result.data[0].detailInfo.gender];
	result.data[0].detailInfo.gender = gender;

	if(result.data.length){
		res = {
			suc: true,
			info: result.data[0].detailInfo
		}
	}else{
		res = {
			suc: false,
			info: '您未登录或登录已过期'
		}
	}

	return res;
	
}