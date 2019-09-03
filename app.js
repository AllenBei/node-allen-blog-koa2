const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors');
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')

const {REDIS_CONF} = require('./config/db')

// error handler
onerror(app)

// 设置头,跨域
app.use(cors({
  origin: function (ctx) {
      // if (ctx.url === '/api') {
      //     return "*"; // 允许来自所有域名请求
      // }
      return ['http://localhost:4444','http://www.aysnc.cn'];
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With'],
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start 
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
const ENV = process.env.NODE_ENV
if(ENV !== 'production') {
  //开发环境
  app.use(morgan('dev'))
}else{
  //线上环境
  const logFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(logFileName,{
    flags:'a'
  })
  app.use(morgan('combined',{
    stream:writeStream//表示可以传入其他参数
  }));
}


app.keys = ['WJiol#8776_'] 
app.use(session({
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000
  },
  store:redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
