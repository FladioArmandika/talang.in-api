
const mongoose  = require('mongoose');
const config    = require('../config');

module.exports = async(app) => {
    console.log(config.db.url)
    const connection = await mongoose.connect(config.db.url, {useNewUrlParser:true, dbName:'talangin',useFindAndModify: false});
    require('../models/debt')
    require('../models/creditor')
    require('../models/friendrequest')
    require('../models/debtrequest')
    require('../models/payoff')
    require('../models/user')
    
    return connection.connection.db;
}