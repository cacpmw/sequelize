const { Router } = require('express');

const adminRouter = require('./admin.routes');
const contractRouter = require('./contract.routes');
const jobRouter = require('./job.routes');
const balanceRouter = require('./balance.routes');

const routes = Router();

routes.use('/contracts', contractRouter)
routes.use('/jobs', jobRouter )
routes.use('/balances', balanceRouter)
routes.use("/admin", adminRouter)

module.exports = { routes };
