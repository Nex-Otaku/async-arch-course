const eventbus = require('./../../Common/EventBus/eventbus');
const schemaRegistry = require('./../../Common/SchemaRegistry/schema-registry');
const accountStorage = require('./storage/accounts-storage');
const tokenStorage = require('./storage/tokens-storage');
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const isValidPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}


// Операции сервиса:

// 1. Добавить пользователя

const registerAccount = async (login, password, role) => {
    await accountStorage.createAccount(login, hashPassword(password), role);
}

// 2. Удалить пользователя

const removeAccount = async (login) => {
    await accountStorage.removeAccount(login);
}

// 3. Пользователь залогинился в систему?

const isLoggedInByToken = async (token) => {
    const tokenRecord = await tokenStorage.findByToken(token);

    if (tokenRecord === null) {
        return {
            account_id: null,
            is_logged_in: false,
        };
    }

    const account = await accountStorage.getAccountById(tokenRecord.account_id);

    return {
        account_id: account.public_id,
        is_logged_in: true,
    }
}

const isLoggedInByAccountId = async (accountId) => {
    const tokenRecord = await tokenStorage.findByAccountId(accountId);

    return tokenRecord !== null;
}

// 4. Какая роль у пользователя?

const getAccountRole = async (accountPublicId) => {
    const account = await accountStorage.getAccountByPublicId(accountPublicId);

    return {
        account_id: account.public_id,
        role: account.role,
    }
}

// 5. Залогиниться

const login = async (login, password) => {
    if (!(await accountStorage.existsLogin(login))) {
        return {
            status: 'fail',
            reason: 'Unknown login name',
        }
    }

    const account = await accountStorage.getAccountByLogin(login);

    if (!isValidPassword(password, account.password_hash)) {
        return {
            status: 'fail',
            reason: 'Invalid password',
        }
    }

    if (await isLoggedInByAccountId(account.id)) {
        const tokenRecord = await findTokenByAccountId(account.id);

        if (tokenRecord === null) {
            throw new Error('Cannot find token');
        }

        return {
            status: 'success',
            token: tokenRecord.token,
        }
    }

    const tokenRecord = await tokenStorage.createToken(account.id);

    const event = {
        topic: 'Accounts',
        name: 'Account.Logined',
        version: 1,
        data: {
            'accountId': account.public_id,
        }
    };

    await schemaRegistry.validateEvent(event, event.name, event.version);
    await eventbus.postEvent(event);

    return {
        status: 'success',
        token: tokenRecord.token,
    }
}

// 6. Разлогиниться

const logout = async (token) => {
    await tokenStorage.removeToken(token);
}

const getAllAccounts = async () => {
    return await accountStorage.getAllAccounts();
}

const findTokenByAccountId = async (accountId) => {
    return await tokenStorage.findByAccountId(accountId) ?? null;
}

module.exports = {
    registerAccount: registerAccount,
    removeAccount: removeAccount,
    isLoggedInByToken: isLoggedInByToken,
    isLoggedInByAccountId: isLoggedInByAccountId,
    getAccountRole: getAccountRole,
    login: login,
    logout: logout,
    getAllAccounts: getAllAccounts,
    findTokenByAccountId: findTokenByAccountId
}