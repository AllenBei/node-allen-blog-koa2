const { exec,escape } = require('../db/mysql')
// const {genPassword} = require('../untils/cryp')

const login = async(username,password) => {
    username = escape(username)

    //加密密码（使用密匙算法来加密，如何反解密?）
    // password = genPassword(password)
    password = escape(password)

    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `
    // console.log('sql语句是'+sql);
    const rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}