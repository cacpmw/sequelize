const { Router } = require('express');
const BalanceController = require('../controllers/BalanceController');
const { getProfile } = require('../middleware/getProfile');

const balanceRouter = Router();

balanceRouter.post('/deposit/:user_id', getProfile, BalanceController.Update)


module.exports = balanceRouter;