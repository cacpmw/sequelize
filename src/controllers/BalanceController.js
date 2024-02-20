const RequestError = require("../exceptions/RequestError");
const FindAUsersJobsService = require("../Services/FindAUsersJobsService");
const UpdateAUsersBalanceService = require("../Services/UpdateAUsersBalanceService");

class BalanceController {

    static async Update(req, res) {
        const { Job, Contract, Profile } = req.app.get('models')
        const { user_id } = req.params
        const amount = Number(req.get("amount"));

        const userProfile = await Profile.findByPk(user_id)

        if (!userProfile) return res.status(404).end()

        if (userProfile.type !== "client") throw new RequestError("Only clients are able to make deposits", 401);

        const jobs = await FindAUsersJobsService.execute(userProfile.id);

        if (!jobs) {
            userProfile.balance += amount;
        } else {
            const sum = jobs.reduce((total, item) => (total + item.price), 0)
            if (amount > (sum * 0.25)) throw new RequestError("Can't deposit more than 25% of total jobs to pay", 422);
        }

        await UpdateAUsersBalanceService.execute(userProfile);


        res.status(200).end();
    }
}
module.exports = BalanceController