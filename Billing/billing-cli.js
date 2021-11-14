const billing = require('./src/billing');
const ui = require('./../Common/ConsoleUi/console-ui');
const sequelize = require('./../Common/Mysql/sequelize');

const processEvent = async () => {
    await billing.processEvent();
    console.log('Обработка событий завершена.');
}

const menu = async () => {
    let running = true;

    while (running) {
        await ui.printHeader('Popug Billing');

        const selectedAction = await ui.selectAction([
            'Обработать событие',
            ui.separator(),
            'Выход',
        ]);

        if (selectedAction === 'Обработать событие') {
            await processEvent();
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

