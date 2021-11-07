const sequelize = require('./../../../Common/Mysql/sequelize');
const publicId = require('./../../../Common/PublicId/public-id');

const createAccount = async (login, passwordHash, role) => {
    await sequelize.models.Account.create({
        public_id: publicId.generateId(),
        role: role,
        login: login,
        password_hash: passwordHash,
    });
}

const removeAccount = async (login) => {
    await sequelize.models.Account.destroy({
        where: {
            login: login,
        }
    });
}

const getAccountById = async (accountId) => {
    const record = await sequelize.models.Account.findOne({
        where: {
            id: accountId,
        }
    });

    if (record === null) {
        throw new Error('Not found account by ID');
    }

    return record;
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

const findByLogin = async (login) => {
    return await sequelize.models.Account.findOne({
        where: {
            login: login,
        }
    });
}

const getAccountByLogin = async (login) => {
    const record = await findByLogin(login);

    if (record === null) {
        throw new Error('Not found account by login');
    }

    return record;
}

const existsLogin = async (login) => {
    const record = await findByLogin(login);

    return record !== null;
}

module.exports = {
    createAccount: createAccount,
    removeAccount: removeAccount,
    getAccountById: getAccountById,
    getAccountByPublicId: getAccountByPublicId,
    getAccountByLogin: getAccountByLogin,
    existsLogin: existsLogin,
}