// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const _ = db.command;
	const { skey, goods_id, isLike } = event;
	const info = await db.collection('userInfo').where({
		skey: skey
	}).field({
		openid: true
	}).get();
	const idArr = new Array(goods_id);

	const { openid } = info.data[0];
	const likes_goods = await db.collection('likes-goods').where({
		openid: openid
	}).get();
	let res;
	if(isLike){
		//添加喜欢的商品
		if(!likes_goods.data.length){
			//第一次添加
			res = await db.collection('likes-goods').add({
				data: {
					openid,
					goods_arr: idArr
				}
			});
		}else{
			//非第一次直接更新数组
			res = await db.collection('likes-goods').where({
				openid: openid
			}).update({
				data: {
					goods_arr: _.push(idArr)
				}
			});
		}
		
	}else{
		//删除喜欢的商品
		const likes_arr = likes_goods.data[0].goods_arr;
		const index = likes_arr.indexOf(goods_id);
		if(index !== -1){
			const deleArr = likes_arr.splice(index, 1);
			res = await db.collection('likes-goods').where({
				openid: openid
			}).update({
				data:{
					goods_arr: likes_arr
				}
			});
		}
	}

	return res;
	
}