var mongoose = require('mongoose');
var models = require('./models');

var Forum = mongoose.model('Forum', models.ForumSchema);

exports.Forum = Forum;
exports.saveForum = function (forumData) {
  var forum = new Forum(forumData);
  return new Promise((resolve, reject) => {
    forum.save()
      .then(forumCreated => {
        resolve(forumCreated);
      }).catch(err => {
        console.log("Error saving forum" + err.message)
        reject(err);
      });
  });
}