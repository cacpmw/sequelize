const RequestError = require("../exceptions/RequestError");
const ListAUsersUnpaidJobs = require("../Services/ListAUsersUnpaidJobsService");

class UnpaidJobController {

    static async Index(req, res) {
        const profile = req.profile;

        const jobs = await ListAUsersUnpaidJobs.execute(profile)
        if (!jobs) throw new RequestError("Not Found", 404)

        const unpaidJobs = jobs.map((current) => (
            {
                id: current.id,
                description: current.description,
                price: current.price,
                paid: current.paid,
                paymentDate: current.paymentDate,
                createdAt: current.createdAt,
                updatedAt: current.updatedAt,
                status: current.Contract.status,
                fullName: current.Contract.Client.fullName
            }
        ));
        res.json(unpaidJobs)
    }

}

module.exports = UnpaidJobController;