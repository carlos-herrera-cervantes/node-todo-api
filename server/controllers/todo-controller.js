const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');

/**
 * @GET
 */

/** @region_snippet_GetAll */
const getAll = (request, response) => {
    Todo.find({ _creator: request.user._id }).then(todos => {
        response.send({ todos });
    }).catch(error => {
        response.status(400).send(error);
    });
};
/** @endregion */

/** @region_snippet_GetById */
const getById = (request, response) => {
    const id = request.params.id;

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
};
/** @endregion */

/**
 * @POST
 */

/** @region_snippet_Create */
const create = (request, response) => {
    const todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });

    todo.save().then(doc => {
        response.send(doc);
    }).catch(error => {
        response.status(400).send(error);
    });
};
/** @endregion */

/** @PATCH */

/** @region_snippet_Update */
const update = (request, response) => {
    const id = request.params.id;
    const body = _.pick(request.body, ['text', 'completed']);

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

    Todo.findOneAndUpdate({ _id: id, _creator: request.user._id }, { $set: body }, { new: true }).then(todo => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }).catch(error => {
        response.status(400).send();
    });
};
/** @endregion */

/**
 * @DELETE
 */

/** @region_snippet_Delete */
const deleteTodo = (request, response) => {
    const id = request.params.id;

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

        response.send({ todo });
    }).catch(error => {
        response.status(400).send();
    });
};
  /** @endregion */

  module.exports = { getAll, getById, create, update, deleteTodo };