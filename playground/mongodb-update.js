const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').findOneAndUpdate({
      _id: new ObjectID('5c947b846be1c279d46233da')
    }, {
      $set: {
        completed: true
      }
    }, {
      returnOriginal: false
    }).then(result => {
      console.log(JSON.stringify(result, undefined, 2));
    });

  db.close();
});
