// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey } = event;
	const userInfo = await db.collection('userInfo').where({
		skey: skey
	}).get();
	const { openid } = userInfo.data[0];
	const goods = await db.collection('unsale-goods').where({
		openid: openid
	}).get();

	return goods.data;
  
}