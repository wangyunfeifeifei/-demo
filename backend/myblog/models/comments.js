const marked = require('marked')
const {Comment} = require('../lib/mongo')

// 将comment的content从markdown转html
Comment.plugin('contentToHtml', {
  afterFind (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一个留言
  create (comment) {
    return Comment.create(comment).exec()
  },
  // 通过留言id 获取一个留言
  getCommentById (commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },
  // 通过留言id 删除一个留言
  delCommentById (commentId) {
    return Comment.deleteOne({_id: commentId}).exec()
  },
  // 通过文章id删除文章所有留言
  delCommentsByPostId (postId) {
    return Comment.deleteMany({postId: postId}).exec()
  },
  // 通过文章id获取该文章下所有留言，按留言创建时间升序
  getComments (postId) {
    return Comment
      .find({postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreateAt()
      .contentToHtml()
      .exec()
  },
  // 通过文章id获取该文章下留言数
  getCommentsCount (postId) {
    return Comment.count({postId}).exec()
  }
}
