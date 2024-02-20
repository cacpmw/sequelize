const FindTheBestProfessionService = require("../../Services/FindTheBestProfessionService");
const RequestError = require("../../exceptions/RequestError");


class BestProfessionController {

    static async Index(req, res) {
        const startDate = String(req.query.start)
        const endDate = String(req.query.end);

        const job = await FindTheBestProfessionService.execute({ startDate, endDate })

        const best = {
            profession: job.Contract.Client.profession,
            amount: job.getDataValue("amount"),
        }

        res.status(200).json(best);
    }
}
module.exports = BestProfessionController