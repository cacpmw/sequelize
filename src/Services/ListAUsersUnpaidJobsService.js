const { Op } = require("sequelize");
const { Job, Contract, Profile } = require("../model");

class ListAUsersUnpaidJobs {
    static async execute(profile) {
        return await Job.findAll({
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
    }
}

module.exports = ListAUsersUnpaidJobs