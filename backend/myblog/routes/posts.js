const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')

const {checkLogin} = require('../middlewares/check')

router.get('/', function (req, res, next) {
  const author = req.query.author

  PostModel.getPosts(author)
    .then(posts => {
      res.render('posts', {
        posts
      })
    }).catch(next)
})

// 发表文章
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const {title, content} = req.fields

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写文章内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author, title, content, pv: 0
  }

  PostModel.create(post)
    .then(result => {
      // 插入mongo后的值
      post = result.ops[0]
      req.flash('success', '发表成功')
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})

// 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

// 获取单独一篇文章页
router.get('/:postId', checkLogin, function (req, res, next) {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId), // 获取文章
    PostModel.incPv(postId) // pv + 1
  ]).then(result => {
    const post = result[0]
    if (!post) {
      throw new Error('文章不存在')
    }
    res.render('post', {
      post
    })
  })
    .catch(next)
})
module.exports = router
