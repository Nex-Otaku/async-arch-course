const sequelize = require('./../../../Common/Mysql/sequelize');

const findAllAccounts = async () => {
    return await sequelize.models.Account.findAll();
}

const findAllDeveloperAccounts = async () => {
    return await sequelize.models.Account.findAll({
        where: {
            role: 'developer',
        }
    });
}

const getAccountByPublicId = async (accountPublicId) => {
    const record = await sequelize.models.Account.findOne({
        where: {
            public_id: accountPublicId,
        }
    });

    if (record === null) {
        throw new Error('Not found account by Public ID');
    }

    return record;
}

module.exports = {
    findAllAccounts: findAllAccounts,
    findAllDeveloperAccounts: findAllDeveloperAccounts,
    getAccountByPublicId: getAccountByPublicId,
}