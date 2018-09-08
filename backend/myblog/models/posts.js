const marked = require('marked')
const {Post} = require('../lib/mongo')
const CommentModel = require('./comments')

// 添加留言数
Post.plugin('addCommentsCount', {
  afterFind (posts) {
    return Promise.all(posts.map(post => {
      return CommentModel.getCommentsCount(post._id).then(commentsCount => {
        post.CommentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(count => {
        post.commentsCount = count
        return post
      })
    }
    return post
  }
})

Post.plugin('contentToHtml', {
  afterFind (posts) {
    return posts.map(post => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 新增文章
  create (post) {
    return Post.create(post).exec()
  },
  // 通过id获取文章
  getPostById (postId) {
    return Post.findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreateAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 按创建时间降序获取所有用户文章或者某个特定用户所有文章页
  getPosts (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post.find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreateAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 通过文章id 给pv + 1
  incPv (postId) {
    return Post.update({_id: postId}, {$inc: {pv: 1}}).exec()
  },
  // 通过文章id 获取原生文章
  getRawPostById (postId) {
    return Post.findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
  },
  // 通过id更新一篇文章
  updatePostById (postId, data) {
    return Post.update({_id: postId}, {$set: data}).exec()
  },
  // 通过id 删除文章
  delPostById (postId) {
    return Post.deleteOne({_id: postId}).exec().then(res => {
      // 文章删除后再删除留言
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.delCommentsByPostId(postId)
      }
    })
  }
}
