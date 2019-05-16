const _ = require('lodash');
const { User } = require('../models/user');

/**
 * @GET
 */

/** @region_snippet_GetAll */

const getAll = (request, response) => response.send(request.user);

/** @endregion */

/**
 * @POST
 */

/** @region_snippet_Create */
const create = (request, response) => {
    const body = _.pick(request.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        response.header('x-auth', token).send(user);
    }).catch(error => {
        response.status(400).send(error);
    });
};
/** @endregion */

/** @region_snippet_Login */
const login = (request, response) => {
    const body = _.pick(request.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            response.header('x-auth', token).send(user);
        });
    }).catch(error => {
        response.status(400).send();
    });
};
/** @endregion */

/**
 * @DELETE
 */

/** @region_snippet_Delete (Logout) */
const logout = (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }, () => {
        response.status(400).send();
    });
};
/** @endregion */

module.exports = { getAll, create, login, logout };