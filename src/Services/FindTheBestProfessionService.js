const { Op } = require("sequelize");
const { Job, sequelize, Contract, Profile } = require("../model");

class FindTheBestProfessionService {

    static async execute({ startDate, endDate }) {
        await Job.findOne({
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
    }

}
module.exports = FindTheBestProfessionService