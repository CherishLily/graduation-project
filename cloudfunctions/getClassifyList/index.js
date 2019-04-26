// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const { value, from } = event;
	let list = {};

	
	if(from === 'classify'){
		// 分类查询
		if( value == '书籍' ){
			list = await db.collection('goods').where({
				pub_type: 1
			}).get();
		}else{
			list = await db.collection('goods').where({
				g_type: db.RegExp({
					regexp: value,
					options: 'g',
				})
			}).get();
		}
	}else{
		// 搜索
		list = await db.collection('goods').where({
			title: db.RegExp({
				regexp: value,
				options: 'g',
			})
		}).get();
	}

	return list.data;
}