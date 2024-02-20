const { Router } = require('express');
const BestClientController = require('../controllers/admin/BestClientController');
const BestProfessionController = require('../controllers/admin/BestProfessionController');
const { getProfile } = require('../middleware/getProfile');
const { celebrate, Segments, Joi } = require('celebrate');

const adminRouter = Router();

adminRouter.get('/best-profession', celebrate({
    [Segments.QUERY]: {
        start: Joi.date().required(),
        end: Joi.date().required(),
    },
}), getProfile, BestProfessionController.Index)
adminRouter.get('/best-clients', celebrate({
    [Segments.QUERY]: {
        start: Joi.date().required(),
        end: Joi.date().required(),
        limit: Joi.number().optional(),
    },
}), getProfile, BestClientController.Index)

module.exports = adminRouter;