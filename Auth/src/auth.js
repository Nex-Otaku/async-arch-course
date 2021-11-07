const eventbus = require('./../../Common/EventBus/eventbus');
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

const isLoggedIn = async (token) => {
    const tokenRecord = await tokenStorage.findToken(token);

    if (tokenRecord === null) {
        return {
            account_id: null,
            is_logged_in: false,
        };
    }

    const account = await accountStorage.getAccountById(token.account_id);

    return {
        account_id: account.public_id,
        is_logged_in: true,
    }
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

    const tokenRecord = await tokenStorage.createToken(account.id);

    await eventbus.postEvent({
        topic: 'Accounts',
        name: 'Account.Logined',
        data: {
            'accountId': account.public_id,
        }
    })

    return {
        status: 'success',
        token: tokenRecord.token,
    }
}

// 6. Разлогиниться

const logout = async (token) => {
    await tokenStorage.removeToken(token);
}

module.exports = {
    registerAccount: registerAccount,
    removeAccount: removeAccount,
    isLoggedIn: isLoggedIn,
    getAccountRole: getAccountRole,
    login: login,
    logout: logout,
}