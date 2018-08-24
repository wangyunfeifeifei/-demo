const express = require('express')
const router = express.Router()

const {checkLogin} = require('../middlewares/check')

router.get('/', checkLogin, function (req, res, next) {
  // 清空sessino中用户信息
  req.session.user = null
  req.flash('success', '登出成功')
  // 登出成功跳转主页
  res.redirect('/posts')
})

module.exports = router
