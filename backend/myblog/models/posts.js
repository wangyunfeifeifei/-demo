const marked = require('marked')
const {Post} = require('../lib/mongo')

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
      .contentToHtml()
      .exec()
  },
  // 通过文章id 给pv + 1
  incPv (postId) {
    return Post.update({_id: postId}, {$inc: {pv: 1}}).exec()
  }
}
