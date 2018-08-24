const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const {checkNotLogin} = require('../middlewares/check')

// 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  let {name, gender, bio, password, repassword} = req.fields
  const avatar = req.files.avatar.path.split(path.sep).pop()

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在1-10个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name, password, gender, bio, avatar
  }
  // 用户信息写入数据库
  UserModel.create(user).then(function (result) {
    // 此user是插入mongodb后的值，包含_id
    user = result.ops[0]
    // 将用户信息存入 session
    delete user.password
    req.session.user = user
    // 写入flash
    req.flash('success', '注册成功')
    // 跳转到首页
    res.redirect('/posts')
  })
    .catch(function (e) {
      // 用户名被占用则调回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
