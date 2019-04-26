// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, id, status } = event;  // skey用于判断该用户是否收藏了该商品
	let detail;
	if(status == 0){ //status为0，表示已下架的商品
		detail = await db.collection('unsale-goods').doc(id).get();
	}else{
		detail = await db.collection('goods').doc(id).get();
	}
	
	let isLike = false;
	if(skey){
		const info = await db.collection('userInfo').where({
			skey: skey
		}).field({
			openid: true
		}).get();
		if(info.data.length){
			const { openid } = info.data[0];
			const likes = await db.collection('likes-goods').where({
				openid: openid
			}).get();
			if(likes.data.length){
				const likes_arr = likes.data[0].goods_arr;
				if(likes_arr.indexOf(id) !== -1){
					isLike = true;
				}
			}
		}
	}
	return {
		detail,
		isLike
	};
}