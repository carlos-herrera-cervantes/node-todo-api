const { mongoose } = require('../db/mongoose');
const { authenticate } = require('../middleware/authenticated');
const userController = require('../controllers/user-controller');
const todoController = require('../controllers/todo-controller');

const routes = app => {

    /** @TODOS_RESOURCE */
    app.route('/todos')
    .get(authenticate, todoController.getAll)
    .post(authenticate, todoController.create);

    app.route('/todos/:id')
    .get(authenticate, todoController.getById)
    .patch(authenticate,todoController.update)
    .delete(authenticate, todoController.deleteTodo);

    /** @USERS_RESOURCE */
    app.route('/users/me')
    .get(authenticate, userController.getAll);

    app.route('/users')
    .post(userController.create);

    app.route('/users/login')
    .post(userController.login);

    app.route('/users/me/token')
    .delete(authenticate, userController.logout);
};

module.exports = routes;