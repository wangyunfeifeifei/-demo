const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  name: config.session.key, // 设置cookie中保存session id 的字段名称
  secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使产生signedCookie防篡改
  resave: true, // 强制刷新 session
  saveUninitialized: false, // 设置为 false, 强制创建一个session, 即使用户未登录
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({ // 将session 存储到mongodb
    url: config.mongodb // mongo地址
  })
}))

app.use(flash())

// 处理表单及文件上传中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true // 保留后缀
}))

// 设置模板全局变量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

routes(app)

app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
