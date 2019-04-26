// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey } = event;
	const userInfo = await db.collection('userInfo').where({
		skey: skey
	}).get();
	const { openid } = userInfo.data[0];
	const lost = await db.collection('lost-and-found').where({
		openid: openid,
		type_num: 0,
		status: 0
	}).get();
	const found = await db.collection('lost-and-found').where({
		openid: openid,
		type_num: 1,
		status: 0
	}).get();
	const g_lost = await db.collection('lost-and-found').where({
		openid: openid,
		type_num: 0,
		status: 1
	}).get();
	const r_found = await db.collection('lost-and-found').where({
		openid: openid,
		type_num: 1,
		status: 1
	}).get();

	return {
		lost: lost.data,
		found: found.data,
		g_lost: g_lost.data,
		r_found: r_found.data,
		openid,
		skey
	};

}