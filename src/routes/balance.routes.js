const { Router } = require('express');
const BalanceController = require('../controllers/BalanceController');
const { getProfile } = require('../middleware/getProfile');
const { celebrate, Segments, Joi } = require('celebrate');

const balanceRouter = Router();

balanceRouter.post('/deposit/:user_id', celebrate({
    [Segments.PARAMS]: {
        user_id: Joi.number().required(),
    },
    [Segments.BODY]: {
        amount: Joi.number().required()
    }
}), getProfile, BalanceController.Update)


module.exports = balanceRouter;