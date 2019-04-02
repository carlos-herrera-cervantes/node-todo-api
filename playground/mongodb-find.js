const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({ _id: new ObjectID('5c91d5ce9883831620773433') }).toArray().then(docs => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, error => {
  //   console.log('Unable to fetch todos', error);
  // });

  db.collection('Todos').find().count().then(count => {
    console.log(`Todos count: ${count}`);
  }, error => {
    console.log('Unable to fetch todos', error);
  });

  db.close();
});
