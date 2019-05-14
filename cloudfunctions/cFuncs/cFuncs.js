
const cFuncs = {
    deleteLost_found: (event, db) => {
        const { id } = event;
        let result = {};
        return db.collection('lost-and-found').doc(id).remove();
    },

    deleteGoods: (event, db) => {
        const { goods_id, status } = event;
        if(status == 1){
            return db.collection('goods').doc(goods_id).remove();
        }else if(status == 0){
            return db.collection('unsale-goods').doc(goods_id).remove();
        }
    },

    changeLost_status: (event, db) => {
        const { id } = event;
        return db.collection('lost-and-found').doc(id).update({
            data: {
                status: 1
            }
        });
    },

    getLostDetail: (event, db) => {
        const { id } = event;
        return db.collection('lost-and-found').doc(id).get();
    },

    getOthersInfo: (event, db) => {
        const { userId } = event;
        const getInfo = () => db.collection('userInfo').where({
            openid: userId
        }).field({
            detailInfo: true
        }).get();
        const getGoods = () => db.collection('goods').where({
            openid: userId
        }).get();
        const getLost = () => db.collection('lost-and-found').where({
            openid: userId
        }).get();
        return Promise.all([getInfo(), getGoods(), getLost()]);
    }

    
};

module.exports = cFuncs;