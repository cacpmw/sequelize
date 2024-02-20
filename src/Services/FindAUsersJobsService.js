const { Op } = require("sequelize");
const { Job, Contract } = require("../model");

class FindAUsersJobsService {

    static async execute(profileId){
        await Job.findAll({
            include: {
                model: Contract,
                as: "Contract",
                where: {
                    status: {
                        [Op.ne]: "terminated"
                    },
                    ClientId: profileId
                },
            },
            where: {
                paid: null,
            },

        });
    }

} module.exports = FindAUsersJobsService