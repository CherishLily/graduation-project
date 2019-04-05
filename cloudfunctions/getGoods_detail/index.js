// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, id } = event;  // skey用于判断该用户是否收藏了该商品
	const detail = await db.collection('goods').doc(id).get();
	let isLike = false;
	if(skey){
		const info = await db.collection('userInfo').where({
			skey: skey
		}).field({
			openid: true
		}).get();
		const { openid } = info.data[0];
		const likes = await db.collection('likes-goods').where({
			openid: openid
		}).get();
		const likes_arr = likes.data[0].goods_arr;
		if(likes_arr.indexOf(id) !== -1){
			isLike = true;
		}
	}
	return {
		detail,
		isLike
	};
}