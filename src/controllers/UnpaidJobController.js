const { Op } = require("sequelize");
const RequestError = require("../exceptions/RequestError");

class UnpaidJobController {

    static async Index(req, res) {
        const { Job, Contract, Profile } = req.app.get('models')
        const profile = req.profile;

        const jobs = await Job.findAll({
            where: {
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
                include: {
                    model: Profile,
                    as: "Client",
                    where: {

                        id: profile.id
                    }
                }

            },


        });
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