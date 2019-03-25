//编辑修改个人信息
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, nickName, gender, autograph, dormitoryArea, phoneNumber, weChat, avatarUrl} = event;
	const res = await db.collection('userInfo').where({
    		skey: skey
    	}).get();
	const g_map = {
		'男': 1,
		'女': 2
	};
	const _gender = g_map[gender];
	let result;
    	if(res.data.length) {
    		await db.collection('userInfo').doc(res.data[0]._id).update({
				data: {
					skey,
					detailInfo:{
						nickName, 
						autograph, 
						dormitoryArea, 
						phoneNumber, 
						weChat, 
						avatarUrl,
						gender: _gender
					}
				}
			});
    		result = {
    			suc: true,
    			msg: '修改成功'
    		}
    	}else{
    		result = {
    			suc: false,
    			msg: '您未登录或登录已过期'
    		}
    	}

    	return result;
}