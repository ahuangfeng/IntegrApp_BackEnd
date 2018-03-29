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

exports.getForums = function(types){
  return new Promise((resolve,reject) => {
    if(!Array.isArray(types)){
      var error = {message : "Types tiene que ser un array"};
      reject(error);
    }
    if(types.length > 0){
      var typesQuery = [];
      types.forEach(element => {
        typesQuery.push({type: element});
      });
      Forum.find({$or:typesQuery}, (err, forums) => {
        if(err){
          console.log("Error finding forums with this types", err);
          reject(err);
        }
        resolve(forums);
      });
    }else{
      Forum.find({}, (err, forums) => {
        if(err){
          console.log("Error finding all forums", err);
          reject(err);
        }
        resolve(forums);
      });
    }
  })
}