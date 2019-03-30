const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

beforeEach(done => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('GET /todos', () => {
  /**@region_snippet_TestGetAll*/
  it('Should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(response => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
  /**@endregion*/
});

describe('GET /todos/:id', () => {
  /**@region_snippet_TestGetById*/
  it('Should return todo doc', done => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  /**@endregion*/

  /**@region_snippet_TestEmptyId*/
  it('Should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
  /**@endregion*/

  /**@region_snippet_TestInavlidId*/
  it('Should return 404 for invalid id', done => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done);
  });
  /**@endregion*/
});

describe('POST /todos', () => {
  /**@region_snippet_TestPost*/
  it('Should create a new todo', done => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(response => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.find({ text }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch(error => done(error));
    });
  });
  /**@endregion*/

  /**@region_snippet_TestPostEmpty*/
  it('Should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch(error => done(error));
    });
  });
  /**@endregion*/
});

describe('DELETE /todos/:id', () => {
  /**@region_snippet_TestDelete*/
  it('Should remove a todo', done => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect(response => {
      expect(response.body.todo._id).toBe(hexId);
    })
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      Todo.findById(hexId).then(todo => {
        expect(todo).toNotExist();
        done();
      }).catch(error => done(error));
    });
  });
  /**@endregion*/

  /**@snippet_region_TestNotFound*/
  it('Should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
  /**@endregion*/

  /**@region_snippet_TestIvalidId*/
  it('Should return 404 if object id is invalid', done => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done);
  });
  /**@endregion*/
});
