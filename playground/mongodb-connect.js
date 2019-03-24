const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something todo',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     console.log('Unable to insert todo');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
//   db.collection('Users').insertOne({
//     name: 'Carlos Herrera',
//     age: 24,
//     location: 'Acapulco'
//   }, (error, result) => {
//     if (error) {
//       console.log('Unable to insert user');
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//
//   db.close();
});
