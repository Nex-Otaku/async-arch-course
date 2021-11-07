const eventbus = require('./../../Common/EventBus/eventbus');
const taskStorage = require('./storage/tasks-storage');
const readAccountStorage = require('./storage/read-accounts-storage');

const getRandomElement = (items) => {
    return items[Math.floor(Math.random() * items.length)];
}

const assignTask = async (taskId) => {
    const task = await taskStorage.getTaskById(taskId);

    const accounts = await readAccountStorage.findAllAccounts();
    const randomAccount = getRandomElement(accounts);
    await taskStorage.assignTask(task.id, randomAccount.public_id);

    await eventbus.postEvent({
        topic: 'Tasks',
        name: 'Task.Assigned',
        data: {
            'taskId': task.public_id,
        }
    })
}

// Операции сервиса:

// 1. Создать задачу

const createTask = async (description) => {
    const task = await taskStorage.createTask(description);
    await assignTask(task.id);
}

// 2. Завершить задачу

const completeTask = async (taskPublicId) => {
    const task = await taskStorage.getTaskByPublicId(taskPublicId);

    await taskStorage.markTaskAsCompleted(task.id);

    await eventbus.postEvent({
        topic: 'Tasks',
        name: 'Task.Completed',
        data: {
            'taskId': task.public_id,
        }
    })
}

// 3. Зассайнить все задачи

const assignAllTasks = async () => {
    const tasks = await taskStorage.findAllTasks();

    if (tasks.length === 0) {
        return;
    }

    for (const task of tasks) {
        await assignTask(task.id);
    }
}

// 4. Выбрать все задачи назначенные мне

const findTasksAssignedToAccount = async (accountPublicId) => {
    // TODO
}

// 5. Выбрать все задачи, завершённые за сегодня

const findTodayCompletedTasks = async () => {
    // TODO
}

// 6. Выбрать все задачи, назначенные сегодня

const findTodayAssignedTasks = async () => {
    // TODO
}

// 7. Выбрать самую дорогую задачу за период

const findMostExpensiveTask = async (startDate, finishDate) => {
    // TODO
}
