const env = process.env.NODE_ENV //环境参数


//配置
let MYSQL_CONF
// MYSQL_CONF = {
//     host:'localhost',
//     user:'root',
//     password:'root',
//     port:'3306',
//     database:'myblog'
// }

//redis
// REDIS_CONF = {
//     port:6379,
//     host:"127.0.0.1"
// }
if(env === 'dev'){
    //mysql
    MYSQL_CONF = {
        host:'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'myblog'
    }

    //redis
    REDIS_CONF = {
        port:6379,
        host:"127.0.0.1"
    }
}
else if(env === 'production'){
    //mysql
    MYSQL_CONF = {
        host:'bdm708080141.my3w.com',
        user:'bdm708080141',
        password:'async.cn/Sql',
        port:'3306',
        database:'myblog'
    }

    //redis
    REDIS_CONF = {
        port:6379,
        host:"39.96.38.148"
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}