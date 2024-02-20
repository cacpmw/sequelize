const RequestError = require("../exceptions/RequestError");
const { sequelize } = require("../model");

class UpdateAUsersBalanceService {
    static async execute(profile) {
        const transaction = await sequelize.transaction();
        try {
            await profile.save({
                transaction
            });
            await transaction.commit();
            return 0;
        } catch (error) {
            console.error(`An error occurred: ${JSON.stringify(error)}`);
            await transaction.rollback();
            throw new RequestError("Internal Server Error", 500);
        }
    }
} module.exports = UpdateAUsersBalanceService