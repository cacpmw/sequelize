const { Op } = require("sequelize");
const { sequelize } = require('../../model');


class BestProfessionController {

    static async Index(req, res) {
        const { Job, Contract, Profile } = req.app.get('models')
        const startDate = String(req.query.start)
        const endDate = String(req.query.end);

        const job = await Job.findOne({
            attributes: [[sequelize.fn("sum", sequelize.col("price")), "amount"]],
            include: {
                model: Contract,
                as: "Contract",
                attributes: ["id", "ClientId"],
                include: {
                    model: Profile,
                    as: "Client",
                    attributes: ["id", "firstName", "lastName", "profession"],
                }
            },
            where: {
                paid: 1,
                paymentDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
            order: [['amount', 'DESC']],
            limit: 1

        });

        const best = {
            profession: job.Contract.Client.profession,
            amount: job.getDataValue("amount"),
        }

        res.status(200).json(best);
    }
}
module.exports = BestProfessionController