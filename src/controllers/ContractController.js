const { Op } = require("sequelize");
const RequestError = require("../exceptions/RequestError");

class ContractController {

    static async Index(req, res) {
        const { Contract } = req.app.get('models')
        const profile = req.profile;
        const { role } = profile


        const contracts = await Contract.findAll({
            where: {
                status: {
                    [Op.ne]: "terminated"
                },
                [role]: profile.id
            }
        });

        if (!contracts) throw new RequestError("Not Found", 404);
        res.json(contracts)
    }

    static async Find(req, res) {
        const { Contract } = req.app.get('models')
        const { id } = req.params
        const profile = req.profile;
        const { role } = profile

        const contract = await Contract.findOne({
            where: {
                id,
                [role]: profile.id
            }
        })
        if (!contract) throw new RequestError("Not Found", 404);
        res.json(contract)
    }

}

module.exports = ContractController;