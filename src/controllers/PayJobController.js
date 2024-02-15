const { Op } = require("sequelize");
const { sequelize } = require("../model");

class PayJobController {
    static async Store(req, res) {
        const { Job, Contract } = req.app.get('models')
        const { job_id } = req.params

        let profile = req.profile;
        const { role } = profile;

        if (role !== "ClientId") {
            return res.status(401).send({
                error: "Only clients are able to make payments"
            })
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
        if (!job) return res.status(404).end();

        if (job.price > profile.balance) {
            return res.status(422).send({
                error: "Insufficient Balance"
            })
        }
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
            return res.status(500).end()
        }

        res.json(job)
    }
}

module.exports = PayJobController