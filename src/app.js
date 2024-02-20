const express = require('express');
require("express-async-errors")
const bodyParser = require('body-parser');
const { routes } = require('./routes/index')
const { sequelize } = require('./model')
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const ExceptionHandler = require("./exceptions/Handler");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.use(routes)
app.use(errors());
app.use(ExceptionHandler);



module.exports = app;
