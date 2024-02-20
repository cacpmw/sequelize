const ListBestClientsService = require("../../Services/ListBestClientsService");
const RequestError = require("../../exceptions/RequestError");

class BestClientController {

    static async Index(req, res) {
        const startDate = String(req.query.start)
        const endDate = String(req.query.end);
        const limit = Number(req.query.limit);

        const jobs = await ListBestClientsService.execute({ startDate, endDate, limit })

        if (!jobs) throw new RequestError("Not Found", 404);

        const bestClients = jobs.map((current) => {
            return {

                id: current.Contract.Client.id,
                fullName: current.Contract.Client.fullName,
                paid: current.getDataValue("paid")

            }
        });

        res.status(200).json(bestClients);
    }
}

module.exports = BestClientController