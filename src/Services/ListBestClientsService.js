const { Op } = require("sequelize");
const { Job, sequelize, Contract, Profile } = require("../model");

class ListBestClientsService {

    static async execute({ startDate, endDate, limit }) {
        return await Job.findAll({
            attributes: [[sequelize.fn("sum", sequelize.col("price")), "paid"]],
            include: {
                model: Contract,
                as: "Contract",
                attributes: ["id", "ClientId"],
                include: {
                    model: Profile,
                    as: "Client",
                    attributes: ["id", "firstName", "lastName"],
                }

            },
            where: {
                paid: 1,
                paymentDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
            order: [['paid', 'DESC']],
            limit: limit || 2

        });
    }

} module.exports = ListBestClientsService