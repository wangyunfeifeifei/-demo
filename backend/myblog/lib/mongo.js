const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()

mongolass.connect(config.mongodb)
mongolass.plugin('addCreateAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f', 'x']},
  bio: {type: 'string'}
})

exports.User.index({name: 1}, {unique: true}).exec() // 根据用户名查找用户

exports.Post = mongolass.model('Post', {
  author: {type: Mongolass.Types.ObjectId},
  title: {type: 'string'},
  content: {type: 'string'},
  pv: {type: 'number'}
})
exports.Post.index({author: 1, _id: -1}).exec() // 按创建时间降序查看文章列表

exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId, require: true},
  content: {type: 'string', require: true},
  postId: {type: Mongolass.Types.ObjectId, require: true}
})
exports.Comment.index({postId: 1, _id: 1}).exec() // 通过文章id获取该文章所有留言，按留言创建时间升序
