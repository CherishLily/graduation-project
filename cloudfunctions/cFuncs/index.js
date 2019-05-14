// 云函数入口文件
const cloud = require('wx-server-sdk');
const cFuncs = require('./cFuncs');

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
	const { api_name } = event;
	let res = {};
	if(api_name){
		res = await cFuncs[api_name](event, db);
	}
	return res;



	/**
	 * deleteLost_found
	 */
	// const { id } = event;
	// const res = await db.collection('lost-and-found').doc(id).remove();
	// return res;

}