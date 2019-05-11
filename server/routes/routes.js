const _ = require('lodash');

const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose');
var { Todo } = require('../models/todo');
var { User } = require('../models/user');
var { authenticate } = require('../middleware/authenticated');

const routes = app => {
    /**
 * @TODOS_RESOURCE
 * @route 'localhost/3000/todos'
 */

/**
* @GET
*/
/** @region_snippet_GetAll */
app.get('/todos', authenticate, (request, response) => {
    Todo.find({ _creator: request.user._id }).then(todos => {
      response.send({ todos });
    }, error => {
      response.status(400).send(error);
    });
  });
  /** @endregion */
  
  /** @region_snippet_GetById */
  app.get('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
  
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }
  
    Todo.findOne({
      _id: id,
      _creator: request.user._id
    }).then(todo => {
      if (!todo) {
        return response.status(404).send();
      }
  
      response.send({ todo });
    }).catch(error => {
      response.status(400).send();
    });
  });
  /** @endregion */
  
  /**
  * @POST
  */
  /** @region_snippet_Create */
  app.post('/todos', authenticate, (request, response) => {
    var todo = new Todo({
      text: request.body.text,
      _creator: request.user._id
    });
  
    todo.save().then(doc => {
      response.send(doc);
    }, error => {
      response.status(400).send(error);
    });
  });
  /** @endregion */
  
  /**
  * @DELETE
  */
  /** @region_snippet_Delete */
  app.delete('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
  
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }
  
    Todo.findOneAndRemove({
      _id: id,
      _creator: request.user._id
    }).then(todo => {
      if (!todo) {
        return response.status(404).send();
      }
  
      response.send({todo});
    }).catch(error => {
      response.status(400).send();
    });
  });
  /** @endregion */
  
  /**
  * @PATCH
  */
  /** @region_snippet_Patch */
  app.patch('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);
  
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }
  
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    }
    else {
      body.completed = false;
      body.completedAt = null;
    }
  
    Todo.findOneAndUpdate({ _id: id, _creator: request.user._id }, {$set: body}, {new: true}).then(todo => {
      if (!todo) {
        return response.status(404).send();
      }
  
      response.send({todo});
    }).catch(error => {
      response.status(400).send();
    });
  });
  /** @endregion */
  
  /**
   * @USERS_RESOURCE
   * @route 'localhost:3000/users'
   */
  
  /**
   * @GET
  */
  /** @region_snippet_GetMe */
  app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
  });
  /** @endregion */
  
   /**
    * @POST
    */
  /** @region_snippet_Create */
  app.post('/users', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then(token => {
      response.header('x-auth', token).send(user);
    }).catch(error => {
      response.status(400).send(error);
    });
  });
  /** @endregion */
  
  /** @region_snippet_Login */
  app.post('/users/login', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then(user => {
      return user.generateAuthToken().then(token => {
        response.header('x-auth', token).send(user);
      });
    }).catch(error => {
      response.status(400).send();
    });
  });
  /** @endregion */
  
  /**
   * @DELETE
   */
  
   /** @region_snippet_Delete */
   app.delete('/users/me/token', authenticate, (request, response) => {
     request.user.removeToken(request.token).then(() => {
       response.status(200).send();
     }, () => {
       response.status(400).send();
     });
   });
   /** @endregion */
};

module.exports = routes;