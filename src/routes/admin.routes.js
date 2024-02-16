const { Router } = require('express');
const BestClientController = require('../controllers/admin/BestClientController');
const BestProfessionController = require('../controllers/admin/BestProfessionController');
const { getProfile } = require('../middleware/getProfile');

const adminRouter = Router();

adminRouter.get('/best-profession', getProfile, BestProfessionController.Index)
adminRouter.get('/best-clients', getProfile, BestClientController.Index)

module.exports = adminRouter;