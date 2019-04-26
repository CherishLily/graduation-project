// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const { id } = event;
	const res = await db.collection('lost-and-found').doc(id).get();
	return res;


}