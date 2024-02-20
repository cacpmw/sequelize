const RequestError = require("../exceptions/RequestError");
const FindAJobByIdService = require("../Services/FindAJobByIdService");
const PayForAJobService = require("../Services/PayForAJobService");

class PayJobController {
    static async Store(req, res) {
        const { job_id } = req.params

        let profile = req.profile;
        const { role } = profile;

        if (role !== "ClientId") {
            throw new RequestError("Only clients are able to make payments", 401)
        }

        const job = await FindAJobByIdService.execute({ job_id, profile });

        if (!job) throw new RequestError("Not Found", 404)

        if (job.price > profile.balance) throw new RequestError("Insufficient Balance", 422);

        await PayForAJobService.execute({ job, profile });

        res.json(job)
    }
}

module.exports = PayJobController