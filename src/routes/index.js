const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const { sequelize } = require('../model');
const { Op } = require('sequelize');

const routes = Router();

routes.get('/contracts/:id', getProfile, async (req, res) => {
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
    if (!contract) return res.status(404).end()
    res.json(contract)
})
routes.get('/contracts', getProfile, async (req, res) => {
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

    if (!contracts) return res.status(404).end()
    res.json(contracts)
})
routes.get('/jobs/unpaid', getProfile, async (req, res) => {
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
    if (!jobs) return res.status(404).end()

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
})
routes.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const { Job, Contract } = req.app.get('models')
    const { job_id } = req.params

    let profile = req.profile;
    const { role } = profile;

    if (role !== "ClientId") {
        return res.status(401).send({
            error: "Only clients are able to make payments"
        })
    }

    const job = await Job.findOne({
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
    if (!job) return res.status(404).end();

    if (job.price > profile.balance) {
        return res.status(422).send({
            error: "Insufficient Balance"
        })
    }
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
        return res.status(500).end()
    }

    res.json(job)
})

routes.post('/balances/deposit/:user_id', getProfile, async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { user_id } = req.params
    const amount = Number(req.get("amount"));

    if (Number.isNaN(amount)) {
        return res.status(400).send({
            error: "Amount must be a number"
        })
    }
    const userProfile = await Profile.findByPk(user_id)

    if (!userProfile) return res.status(404).end()

    if (userProfile.type !== "client") {
        return res.status(401).send({
            error: "Only clients are able to make deposits"
        })
    }

    const jobs = await Job.findAll({
        include: {
            model: Contract,
            as: "Contract",
            where: {
                status: {
                    [Op.ne]: "terminated"
                },
                ClientId: userProfile.id
            },
        },
        where: {
            paid: null,
        },

    });

    if (!jobs) {
        userProfile.balance += amount;
    } else {
        const sum = jobs.reduce((total, item) => (total + item.price), 0)
        if (amount > (sum * 0.25)) {
            return res.status(422).send({
                error: "Can't deposit more than 25% of total jobs to pay"
            })
        }
    }

    const transaction = await sequelize.transaction();
    try {
        await userProfile.save({
            transaction
        });
        await transaction.commit();
    } catch (error) {
        console.error(`An error occurred: ${JSON.stringify(error)}`);
        await transaction.rollback();
        return res.status(500).end()
    }

    res.status(200).end();
})

routes.get('/admin/best-profession', getProfile, async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const startDate = String(req.query.start)
    const endDate = String(req.query.end);

    const job = await Job.findOne({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "amount"]],
        include: {
            model: Contract,
            as: "Contract",
            attributes: ["id", "ClientId"],
            include: {
                model: Profile,
                as: "Client",
                attributes: ["id", "firstName", "lastName", "profession"],
            }
        },
        where: {
            paid: 1,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
        order: [['amount', 'DESC']],
        limit: 1

    });

    const best = {
        profession: job.Contract.Client.profession,
        amount: job.getDataValue("amount"),
    }

    res.status(200).json(best);
})

routes.get('/admin/best-clients', getProfile, async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const startDate = String(req.query.start)
    const endDate = String(req.query.end);
    const limit = Number(req.query.limit);

    const jobs = await Job.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "paid"]],
        include: {
            model: Contract,
            as: "Contract",
            attributes: ["id", "ClientId"],
            include: {
                model: Profile,
                as: "Client",
                attributes: ["id", "firstName", "lastName"],
            }

        },
        where: {
            paid: 1,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
        order: [['paid', 'DESC']],
        limit: limit || 2

    });

    const bestClients = jobs.map((current) => {
        return {

            id: current.Contract.Client.id,
            fullName: current.Contract.Client.fullName,
            paid: current.getDataValue("paid")

        }
    });

    res.status(200).json(bestClients);
})

module.exports = { routes };
