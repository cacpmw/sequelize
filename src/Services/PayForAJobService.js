const RequestError = require("../exceptions/RequestError");
const { sequelize } = require("../model");

class PayForAJobService {

    static async execute({job, profile}) {
        const transaction = await sequelize.transaction();

        try {
            let contractor = await job.Contract.getContractor();
            profile.balance -= job.price;
            contractor.balance += job.price;
            job.paid = 1;
            job.paymentDate = Date.now();
            await contractor.save({
                transaction
            });
            await profile.save({
                transaction
            });
            await job.save({
                transaction
            });
            await transaction.commit();
        } catch (error) {
            console.error(`An error occurred: ${JSON.stringify(error)}`);
            await transaction.rollback();
            throw new RequestError("Internal Server Error", 500)
        }
    }
}

module.exports = PayForAJobService