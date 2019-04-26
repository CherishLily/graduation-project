// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const { startNum } = event;
	const count = await db.collection('lost-and-found').count();
	const total = count.total;
	let limitNum = 10;
	let start = total - (startNum+1) * 10
	if(start<0){
		start = 0;
		limitNum = total - startNum * 10;
	}
	const list = await db.collection('lost-and-found').skip(start).limit(limitNum).get();
	return {
		list,
		isLast: !start  //标志是否为最后的数据
	};
}