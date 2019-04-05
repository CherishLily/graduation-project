// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, loadNum } = event;
	const userInfo = await db.collection('userInfo').where({
		skey: skey
	}).get();
	const { openid } = userInfo.data[0];
	const likes = await db.collection('likes-goods').where({
		openid: openid
	}).get();
	const { goods_arr } = likes.data[0];  //喜欢商品的id数组
	let likes_list = [];
	let item = {};
	const len = goods_arr.length
	if(len > 0){
		const maxIndex = len - 1 - loadNum * 10;
		const minIndex = maxIndex >= 10 ? maxIndex - 10 : -1;

		for(let i = maxIndex; i > minIndex; i--){
			item = await db.collection('goods').doc(goods_arr[i]).get();
			likes_list.push(item.data);
		}
	}
	return likes_list;
}