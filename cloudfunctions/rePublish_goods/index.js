// 云函数入口文件
const cloud = require('wx-server-sdk');
const sd = require('silly-datetime');


cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { goods_id } = event;
	const goods = await db.collection('unsale-goods').doc(goods_id).get();
	await db.collection('unsale-goods').doc(goods_id).remove();
	const pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	goods.data.pub_time = pub_time;
	const rePub = await db.collection('goods').add({
		data: goods.data
	});

	return rePub;
}