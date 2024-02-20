const { Op } = require("sequelize");
const { sequelize } = require("../model");
const RequestError = require("../exceptions/RequestError");

class PayJobController {
    static async Store(req, res) {
        const { Job, Contract } = req.app.get('models')
        const { job_id } = req.params

        let profile = req.profile;
        const { role } = profile;

        if (role !== "ClientId") {
            throw new RequestError("Only clients are able to make payments", 401)
        }

        const job = await Job.findOne({
            where: {
                id: job_id,
                paid: null,
            },
            include: {
                model: Contract,
                as: "Contract",
                where: {
                    status: {
                        [Op.ne]: "terminated"
                    },
                    [profile.role]: profile.id
                },
            },


        });
        if (!job) throw new RequestError("Not Found", 404)

        if (job.price > profile.balance) throw new RequestError("Insufficient Balance", 422);

        const transaction = await sequelize.transaction();

        try {
            let contractor = await job.Contract.getContractor();
            profile.balance -= job.price;
            contractor.balance += job.price;
            job.paid = 1;
            job.paymentDate = Date.now();
            await contractor.save({
                transaction
            });
            await profile.save({
                transaction
            });
            await job.save({
                transaction
            });
            await transaction.commit();
        } catch (error) {
            console.error(`An error occurred: ${JSON.stringify(error)}`);
            await transaction.rollback();
            throw new RequestError("Internal Server Error", 500)
        }

        res.json(job)
    }
}

module.exports = PayJobController