const { Op } = require("sequelize");
const { Contract } = require("../model");

class FindAUsersContractService {

    static async execute({ id, role, profileId }) {
        return await Contract.findOne({
            where: {
                id,
                [role]: profileId
            }
        })
    }
}

module.exports = FindAUsersContractService