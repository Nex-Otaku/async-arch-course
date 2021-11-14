const eventbus = require('./../../Common/EventBus/eventbus');
const taskStorage = require('./storage/tasks-storage');
const accountStorage = require('./storage/accounts-storage');
const transferStorage = require('./storage/transfers-storage');
const moneyAccountStorage = require('./storage/money-accounts-storage');
const moneyAuditLogStorage = require('./storage/money-audit-log-storage');

const consumer = 'billing';

// Операции сервиса:

// 1. Списать деньги за ассайн задачи

const withdrawByAssignedTask = async (taskId) => {
    const task = await taskStorage.getTaskByPublicId(taskId);
    const moneyAccount = await moneyAccountStorage.getMoneyAccountByAccountPublicId(task.assigned_account_id);
    await transferStorage.createTransfer(moneyAccount.id, -task.price);

    const account = await accountStorage.getAccountByPublicId(task.assigned_account_id);
    const reason = 'Списание $' + task.price + ' с аккаунта "' + account.login + '" по задаче "' + task.title + '"';
    await moneyAuditLogStorage.createLogRecord(moneyAccount.id, reason);
}

// 2. Начислить деньги за выполнение задачи

const depositByCompletedTask = async (taskId, award) => {
    const task = await taskStorage.getTaskByPublicId(taskId);
    const moneyAccount = await moneyAccountStorage.getMoneyAccountByAccountPublicId(task.assigned_account_id);
    await transferStorage.createTransfer(moneyAccount.id, award);

    const account = await accountStorage.getAccountByPublicId(task.assigned_account_id);
    const reason = 'Начисление $' + award + ' аккаунту "' + account.login + '" за завершение задачи "' + task.title + '"';
    await moneyAuditLogStorage.createLogRecord(moneyAccount.id, reason);
}

//TODO

// 3. Подвести итоги дня

//TODO

// 4. Сделать выплату по итогам дня

//TODO

// 5. Записать аудит лог о начислении денег на счёт или списании денег со счёта

//TODO

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const executeEvent = async (event) => {
    if (event.name === 'Task.Created') {
        const price = getRandomInt(10, 20);
        await taskStorage.createTask(event.taskId, event.title, price);

        return true;
    }

    if (event.name === 'Task.Assigned') {
        await taskStorage.assignTask(event.taskId, event.assignedAccountId);
        await withdrawByAssignedTask(event.taskId);

        return true;
    }

    if (event.name === 'Task.Completed') {
        const award = getRandomInt(20, 40);
        await depositByCompletedTask(event.taskId, award);

        return true;
    }

    return false;
}

const processEvent = async () => {
    const event = await eventbus.readEventByTopic('Tasks', consumer);

    if (event === null) {
        console.log('Нет событий для обработки');

        return;
    }

    console.log('Получено событие: ' + event.name);
    const wasProcessed = await executeEvent(event);

    if (wasProcessed) {
        await eventbus.markEventAsConsumed(event.id, 'Tasks', consumer);
    }
}

module.exports = {
    processEvent: processEvent,
}