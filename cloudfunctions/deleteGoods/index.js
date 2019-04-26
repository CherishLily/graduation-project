// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { goods_id, status } = event;
	let res;
	if(status == 1){
		res = await db.collection('goods').doc(goods_id).remove();
	}else if(status == 0){
		res = await db.collection('unsale-goods').doc(goods_id).remove();
	}

	return res;
  
}