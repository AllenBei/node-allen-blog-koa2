 const {exec} = require('../db/mysql')

 const getList = async (author,keyword) => {
     // 1=1 起语法正确作用。因为 author和keyword不确定
      let sql = `select * from blogs where 1=1 `

      if(author){
          sql += ` and author = '${author}'`
      }

      if(keyword){
        sql += `and title like  '%${keyword}%'`
      }
      sql += `order by createtime desc;`
      
      //返回promise
      return await exec(sql)

 }

 const getDetail = async(id) => {
     const sql = `select * from blogs where id='${id}'`
     const rows =  await exec(sql)
     return rows[0]
 }

 const newBlog = async(blogData = {}) => {``
    const {title,content,author} = blogData
    const createTime = Date.now()
    const sql = `
    insert into blogs (title,content,author,createTime)
    values ('${title}','${content}','${author}',${createTime});
    `
    if([title,content,author].includes(undefined)){
        const errorMessage = await '参数错误'
        return errorMessage
    }else{
        const insertData = await exec(sql)
        return {
            id : insertData.insertId
        }
    }
    
 }

 const updateBlog = async(id,blogData = {}) => {
    const {title,content} = blogData
    
    const sql = `
    update blogs set title='${title}',content='${content}' where id = ${id}
    `
    if([title,content].includes(undefined)){
        const errorMessage = await '参数错误'
        return errorMessage
    }else{
        const updateData = await exec(sql)
        if(updateData.affectedRows > 0){
            return true
        }
        return false
    }

}

const delBlog = async(id,author) => {
    
    const sql = `
    delete from blogs where id = '${id}' and author = '${author}';
    `
        const delData = await exec(sql)
        if(delData.affectedRows > 0){
            return true
        }
        return false
}

 module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 }