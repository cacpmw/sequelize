const { Op } = require("sequelize");
const { Contract } = require("../model");

class ListAllContractsService {

    static async execute({ profileId, role }) {
        return await Contract.findAll({
            where: {
                status: {
                    [Op.ne]: "terminated"
                },
                [role]: profileId
            }
        });
    }
}

module.exports = ListAllContractsService