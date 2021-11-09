const auth = require('./src/auth');
const ui = require('./../Common/ConsoleUi/console-ui');
const sequelize = require('./../Common/Mysql/sequelize');

const createAccount = async () => {
    const name = await ui.inputRequired('Логин', 'popug');
    const password = await ui.inputRequired('Пароль', 'popug');
    const role = await ui.inputRequired('Роль', 'admin');
    await auth.registerAccount(name, password, role);
    console.log('Аккаунт создан.');
}

const runWithAccount = async (callback) => {
    const accounts = (await auth.getAllAccounts()).map(account => { return { name: account.login, value: account } });
    const account = await ui.selectWithCancel('Выберите аккаунт', accounts);

    if (account === '') {
        console.log('Аккаунт не выбран');

        return;
    }

    await callback(account);
}

const removeAccount = async () => {
    await runWithAccount(async (account) => {
        await auth.removeAccount(account.login);
        console.log('Аккаунт удалён.');
    });
}

const viewAccount = async () => {
    await runWithAccount(async (account) => {
        console.log('Аккаунт: ' + account.login);
        console.log('Роль: ' + account.role);
        console.log('Авторизован: ' + ((await auth.isLoggedInByAccountId(account.id)) ? 'Да' : 'Нет'));
    });
}

const loginAccount = async () => {
    await runWithAccount(async (account) => {
        const password = await ui.inputRequired('Пароль');
        const result = await auth.login(account.login, password);

        if (result.status === 'success') {
            console.log('Пользователь был авторизован. Токен: ' + result.token);
        } else {
            console.log('Пользователь не был авторизован. Причина: ' + result.reason);
        }
    });
}

const logoutAccount = async () => {
    await runWithAccount(async (account) => {
        if (!(await auth.isLoggedInByAccountId(account.id))) {
            console.log('Пользователь ещё не авторизовался');

            return;
        }

        const tokenRecord = await auth.findTokenByAccountId(account.id);

        if (tokenRecord === null) {
            throw new Error('Не удалось найти токен');
        }

        await auth.logout(tokenRecord.token);
        console.log('Пользователь был деавторизован.');
    });
}

const menu = async () => {
    let running = true;

    while (running) {
        await ui.printHeader('Popug Auth');

        const selectedAction = await ui.selectAction([
            'Создать аккаунт',
            'Удалить аккаунт',
            'Информация об аккаунте',
            'Залогинить пользователя',
            'Разлогинить пользователя',
            ui.separator(),
            'Выход',
        ]);

        if (selectedAction === 'Создать аккаунт') {
            await createAccount();
        }

        if (selectedAction === 'Удалить аккаунт') {
            await removeAccount();
        }

        if (selectedAction === 'Информация об аккаунте') {
            await viewAccount();
        }

        if (selectedAction === 'Залогинить пользователя') {
            await loginAccount();
        }

        if (selectedAction === 'Разлогинить пользователя') {
            await logoutAccount();
        }

        if (selectedAction === 'Выход') {
            running = false;
        }

        if (running) {
            await ui.keypress();
        }
    }
};

(async () => {
    await menu();
    await sequelize.close();
})();

