const RequestError = require("../exceptions/RequestError");
const ListAllContractsService = require("../Services/ListAllContractsService");
const FindAUsersContractService = require("../Services/FindAUsersContractService");

class ContractController {

    static async Index(req, res) {
        const profile = req.profile;
        const { role } = profile


        const contracts = await ListAllContractsService.execute({
            profileId: profile.id,
            role
        })

        if (!contracts) throw new RequestError("Not Found", 404);
        res.json(contracts)
    }

    static async Find(req, res) {
        const { id } = req.params
        const profile = req.profile;
        const { role } = profile

        const contract = await FindAUsersContractService.execute({ id, role, profileId: profile.id })
        if (!contract) throw new RequestError("Not Found", 404);
        res.json(contract)
    }

}

module.exports = ContractController;