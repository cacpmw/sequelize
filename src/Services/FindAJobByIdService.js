const { Op } = require("sequelize");
const { Job, Contract } = require("../model");

class FindAJobByIdService {

    static async execute({job_id,profile}) {
        return await Job.findOne({
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
    }
}

module.exports = FindAJobByIdService