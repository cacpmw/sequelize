const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');

const BestProfessionController = require('../controllers/admin/BestProfessionController');
const ContractController = require('../controllers/ContractController');
const UnpaidJobController = require('../controllers/UnpaidJobController');
const PayJobController = require('../controllers/PayJobController');
const BalanceController = require('../controllers/BalanceController');
const BestClientController = require('../controllers/admin/BestClientController');

const routes = Router();

routes.get('/contracts/:id', getProfile, ContractController.Find)
routes.get('/contracts', getProfile, ContractController.Index)
routes.get('/jobs/unpaid', getProfile, UnpaidJobController.Index)
routes.post('/jobs/:job_id/pay', getProfile, PayJobController.Store)
routes.post('/balances/deposit/:user_id', getProfile, BalanceController.Update)
routes.get('/admin/best-profession', getProfile, BestProfessionController.Index)
routes.get('/admin/best-clients', getProfile, BestClientController.Index)

module.exports = { routes };
