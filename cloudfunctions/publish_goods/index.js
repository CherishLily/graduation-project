//发布旧物信息
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const openid = cloud.getWXContext().OPENID;
	const { g_type, isNew, title, description, price, pricein, phone, pub_type, pic_url } = event;
	const params = {
		g_type, 
		isNew, 
		title, 
		description, 
		price, 
		pricein, 
		phone, 
		pub_type,  
		openid,
		pic_url
	}
	let add_res = {};
	try{
		await db.collection('goods').add({
		    data: params
		}).then(res=>{
			add_res = res;
		});
	} catch (err) {
		console.log(err);
	}

	return add_res;
}