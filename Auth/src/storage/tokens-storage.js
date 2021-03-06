const sequelize = require('./../../../Common/Mysql/sequelize');
const publicId = require('./../../../Common/PublicId/public-id');

const findByToken = async (token) => {
    return await sequelize.models.Token.findOne({
        where: {
            token: token,
        }
    });
}

const findByAccountId = async (accountId) => {
    return await sequelize.models.Token.findOne({
        where: {
            account_id: accountId,
        }
    });
}

const createToken = async (accountId) => {
    return await sequelize.models.Token.create({
        account_id: accountId,
        token: publicId.generateId(),
    });
}

const removeToken = async (token) => {
    await sequelize.models.Token.destroy({
        where: {
            token: token,
        }
    });
}

module.exports = {
    findByToken: findByToken,
    findByAccountId: findByAccountId,
    createToken: createToken,
    removeToken: removeToken,
}