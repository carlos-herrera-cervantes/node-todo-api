require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

/**
 * @CONFIG
 */
var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

/**
 * @ENDPOINTS
 */
routes(app);

/**
 * @LISTEN
 */
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
