const { Op } = require("sequelize");
const { sequelize } = require("../../model");

class BestClientController {

    static async Index(req, res) {
        const { Job, Contract, Profile } = req.app.get('models')
        const startDate = String(req.query.start)
        const endDate = String(req.query.end);
        const limit = Number(req.query.limit);

        const jobs = await Job.findAll({
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