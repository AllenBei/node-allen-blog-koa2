const router = require('koa-router')()
const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const {username,password} = ctx.request.body
  // console.log(username,password);
  const data = await login(username,password)
  console.log(data);
  if(data.username){
      //设置session  若退出注销用ctx.session.destroy();
      ctx.session.username = data.username
      ctx.session.realname = data.realname
      // ctx.session.save();
      ctx.body= new SuccessModel()
      return;
  }
  ctx.body= new ErrorModel('登录失败')
})

router.get('/login-test', async (ctx, next) => {
  if(ctx.session.username){
    ctx.body = {
        errno:0,
        msg:'testing successfully'
    }
    return;
  }
  ctx.body = {
      errno:-1,
      msg:'未登录'
  }
})

module.exports = router
