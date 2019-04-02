const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({ text: 'Do workout' }).then(result => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then(result => {
  //   console.log(result);
  // });

  // db.collection('Todos').findOneAndDelete({ _id: new ObjectID('5c91d5ce9883831620773433') }).then(result => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  db.close();
});
