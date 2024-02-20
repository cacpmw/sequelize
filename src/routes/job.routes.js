const UnpaidJobController = require('../controllers/UnpaidJobController');
const { Router } = require('express');
const PayJobController = require('../controllers/PayJobController');
const { getProfile } = require('../middleware/getProfile');
const { celebrate, Segments, Joi } = require('celebrate');

const jobRouter = Router();

jobRouter.get('/unpaid', getProfile, UnpaidJobController.Index)
jobRouter.post('/:job_id/pay', celebrate({
    [Segments.PARAMS]: {
        job_id: Joi.number().required(),

    }
}) ,getProfile, PayJobController.Store)

module.exports = jobRouter;