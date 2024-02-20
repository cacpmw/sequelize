const { Router } = require('express');
const ContractController = require('../controllers/ContractController');
const { getProfile } = require('../middleware/getProfile');
const { celebrate, Segments, Joi } = require('celebrate');

const contractRouter = Router();

contractRouter.get('/', getProfile, ContractController.Index)
contractRouter.get('/:id', celebrate({
    [Segments.PARAMS]: {
        id: Joi.number().required(),

    },
}), getProfile, ContractController.Find)

module.exports = contractRouter;