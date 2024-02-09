const express = require('express');
const bodyParser = require('body-parser');
const { routes } = require('./routes/index')
const { sequelize } = require('./model')
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(routes)

module.exports = app;
