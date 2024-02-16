const UnpaidJobController = require('../controllers/UnpaidJobController');
const { Router } = require('express');
const PayJobController = require('../controllers/PayJobController');
const { getProfile } = require('../middleware/getProfile');

const jobRouter = Router();

jobRouter.get('/unpaid', getProfile, UnpaidJobController.Index)
jobRouter.post('/:job_id/pay', getProfile, PayJobController.Store)

module.exports = jobRouter;