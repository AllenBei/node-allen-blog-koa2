const router = require('koa-router')()

router.prefix('/api/blog')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
const {SuccessModel,ErrorModel} = require('../model/resModel')

router.get('/list', async (ctx, next) => {
    const {query} = ctx
    ctx.body = {
      errno:0,
      data:'testing blog',
      query    
    }
    const author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    const listData = await getList(author,keyword)
    ctx.body = new SuccessModel (listData)
})

router.get('/detail',async (ctx, next)=>{
    const result =await getDetail(ctx.query.id)
    ctx.body = new SuccessModel (result)  
})

router.post('/new',loginCheck,async (ctx, next)=>{
    const {body} = ctx.request
    body.author = ctx.session.username 
    const result =await newBlog(body)
    ctx.body = new SuccessModel (result)
})

router.post('/update',loginCheck,async (ctx, next)=>{
    const result = await updateBlog(ctx.query.id,ctx.request.body)
    if(result){
        ctx.body = new SuccessModel ('更新博客成功')
    }else{
        ctx.body = new SuccessModel ('更新博客失败')
    }
})

router.post('/del',loginCheck,async (ctx, next)=>{
    const author = ctx.session.username
    const result =await delBlog(ctx.query.id,author)
    if(result){
        ctx.body = new SuccessModel (result)
    }else{
        ctx.body = new ErrorModel ('删除博客失败')
    }
})

module.exports = router
