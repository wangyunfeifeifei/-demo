const express = require('express')
const router = express.Router()

const {checkNotLogin} = require('../middlewares/check')

router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

router.post('/', checkNotLogin, function (req, res, next) {
  res.send('注册')
})

module.exports = router
