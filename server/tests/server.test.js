const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  {
    text: 'First test todo'
  },
  {
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
