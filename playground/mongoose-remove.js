const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.Remove({}).then(result => {
//   console.log(result);
// });

//Todo.findOneAndRemove({})
Todo.findByIdAndRemove('5c9b18b0d18b0e12e61382de').then(result => {
  console.log(result);
});
