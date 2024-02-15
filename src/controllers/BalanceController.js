const { Op } = require("sequelize");
const { sequelize } = require("../model");

class BalanceController {

    static async Update(req, res){
        const { Job, Contract, Profile } = req.app.get('models')
        const { user_id } = req.params
        const amount = Number(req.get("amount"));

        if (Number.isNaN(amount)) {
            return res.status(400).send({
                error: "Amount must be a number"
            })
        }
        const userProfile = await Profile.findByPk(user_id)

        if (!userProfile) return res.status(404).end()

        if (userProfile.type !== "client") {
            return res.status(401).send({
                error: "Only clients are able to make deposits"
            })
        }

        const jobs = await Job.findAll({
            include: {
                model: Contract,
                as: "Contract",
                where: {
                    status: {
                        [Op.ne]: "terminated"
                    },
                    ClientId: userProfile.id
                },
            },
            where: {
                paid: null,
            },

        });

        if (!jobs) {
            userProfile.balance += amount;
        } else {
            const sum = jobs.reduce((total, item) => (total + item.price), 0)
            if (amount > (sum * 0.25)) {
                return res.status(422).send({
                    error: "Can't deposit more than 25% of total jobs to pay"
                })
            }
        }

        const transaction = await sequelize.transaction();
        try {
            await userProfile.save({
                transaction
            });
            await transaction.commit();
        } catch (error) {
            console.error(`An error occurred: ${JSON.stringify(error)}`);
            await transaction.rollback();
            return res.status(500).end()
        }

        res.status(200).end();
    }
}
module.exports = BalanceController