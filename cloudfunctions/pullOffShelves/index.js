// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const { goods_id } = event;
	const goods_item = await db.collection('goods').doc(goods_id).get();
	await db.collection('unsale-goods').add({
		data: goods_item.data
	});
	const res = await db.collection('goods').doc(goods_id).remove();
	return res;
}