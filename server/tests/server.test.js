const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

/**
 * @TODOS_RESOURCE
 */

 /**
  * @GET
  */
describe('GET /todos', () => {
  /** @region_snippet_TestGetAll */
  it('Should get all todos', done => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(response => {
        expect(response.body.todos.length).toBe(1);
      })
      .end(done);
  });
  /** @endregion */
});

describe('GET /todos/:id', () => {
  /** @region_snippet_TestGetById */
  it('Should return todo doc', done => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestNotReturnTodoDiferentUser */
  it('Should not return todo created by other user', done => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestEmptyId */
  it('Should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestInavlidId */
  it('Should return 404 for invalid id', done => {
    request(app)
    .get('/todos/123abc')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  /** @endregion */
});

/**
 * @POST
 */

describe('POST /todos', () => {
  /** @region_snippet_TestPost */
  it('Should create a new todo', done => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
  /** @endregion */

  /** @region_snippet_TestPostEmpty */
  it('Should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
  /** @endregion */
});

/**
 * @DELETE
 */

describe('DELETE /todos/:id', () => {
  /** @region_snippet_TestDelete */
  it('Should remove a todo', done => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
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
  /** @endregion */

  /** @region_snippet_TestNotDeleteTodoDifferentUser */
  it('Should not remove a todo created by other user', done => {
    var hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      Todo.findById(hexId).then(todo => {
        expect(todo).toExist();
        done();
      }).catch(error => done(error));
    });
  });
  /** @endregion */

  /** @snippet_region_TestNotFound */
  it('Should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestIvalidId */
  it('Should return 404 if object id is invalid', done => {
    request(app)
    .get('/todos/123abc')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
  /** @endregion */
});

/**
 * @PATCH
*/

describe('PATCH /todos/:id', () => {
  /** @region_snippet_TestPatch */
  it('Should update todo', done => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(text);
      expect(response.body.todo.completed).toBe(true);
      expect(response.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestNotPatchTodoDifferentUser */
  it('Should not update todo created by other user', done => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: true,
      text
    })
    .expect(404)
    .end(done);
  });
  /** @endregion */

  /** @snippet_region_TestClearCompletedAt */
  it('Should clear completedAt when todo is not completed', done => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text2';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(text);
      expect(response.body.todo.completed).toBe(false);
      expect(response.body.completedAt).toNotExist();
    })
    .end(done);
  });
  /** @endregion */
});

/**
* @USERS_RESOURCE
*/
describe('GET /users/me', () => {
  /** @region_snippet_TestAuthenticated */
  it('Should return user if authenticated', done => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body._id).toBe(users[0]._id.toHexString());
      expect(response.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestUnhatorized */
  it('Should return 401 if not authenticated', done => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(response => {
      expect(response.body).toEqual({});
    })
    .end(done);
  });
  /** @endregion */
});

describe('POST /users', () => {
  /** @region_snippet_TestCreateUser */
  it('Should create a user', done => {
    var email = 'libi@example.com';
    var password = 'secret';

    request(app)
    .post('/users')
    .send({ email, password })
    .expect(200)
    .expect(response => {
      expect(response.headers['x-auth']).toExist();
      expect(response.body.email).toBe(email);
    })
    .end(error => {
      if (error) {
        return done(error);
      }

      User.findOne({ email }).then(user => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });
  /** @endregion */

  /** @region_snippet_TestInvalidRequest */
  it('Should return validation errors if request is invalid', done => {
    request(app)
    .post('/users')
    .send({
      email: 'carlos',
      password: '123'
    })
    .expect(400)
    .end(done);
  });
  /** @endregion */

  /** @region_snippet_TestEmailInUse */
  it('Should not create user if email in use', done => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: 'secret'
    })
    .expect(400)
    .end(done);
  });
  /** @endregion */
});

describe('POST /users/login', () => {
  /** @region_snippet_TestLogin */
  it('Should login user and return auth token', done => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect(response => {
      expect(response.headers['x-auth']).toExist();
    })
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      User.findById(users[1]._id).then(user => {
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: response.headers['x-auth']
        });
        done();
      }).catch(error => done(error));
    });
  });
  /** @endregion */

  /** @region_snippet_TestInvalidLogin */
  it('Should reject invalid login', done => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + '1'
    })
    .expect(400)
    .expect(response => {
      expect(response.headers['x-auth']).toNotExist();
    })
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      User.findById(users[1]._id).then(user => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch(error => done(error));
    });
  });
  /** @endregion */
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', done => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((error, response) => {
      if (error) {
        return done(error);
      }

      User.findById(users[0]._id).then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(error => done(error));
    });
  });
});