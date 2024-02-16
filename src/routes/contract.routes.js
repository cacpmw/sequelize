const { Router } = require('express');
const ContractController = require('../controllers/ContractController');
const { getProfile } = require('../middleware/getProfile');

const contractRouter = Router();

contractRouter.get('/', getProfile, ContractController.Index)
contractRouter.get('/:id', getProfile, ContractController.Find)

module.exports = contractRouter;