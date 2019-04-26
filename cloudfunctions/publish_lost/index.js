// 云函数入口文件
const cloud = require('wx-server-sdk');
const sd = require('silly-datetime');

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const openid = cloud.getWXContext().OPENID;
	const { type, title, description, phone, pic_url, address, f_time, type_num, userDetail } = event;
	const pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	const params = {
		type,
		title, 
		description,
		phone,
		openid,
		pic_url,
		pub_time,
		userDetail,
		type_num,
		address,
		f_time,
		status: 0
	}
	let add_res = {};
	try{
		await db.collection('lost-and-found').add({
		    data: params
		}).then(res=>{
			add_res = res;
		});
	} catch (err) {
		console.log(err);
	}

	return add_res;

}