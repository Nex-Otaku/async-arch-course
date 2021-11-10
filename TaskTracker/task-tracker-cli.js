const taskTracker = require('./src/task-tracker');
const ui = require('./../Common/ConsoleUi/console-ui');
const sequelize = require('./../Common/Mysql/sequelize');

const createTask = async () => {
    const description = await ui.inputRequired('Описание задачи', 'TODO');
    await taskTracker.createTask(description);
    console.log('Задача создана.');
}

const getTaskLabel = async (task) => {
    const account = await taskTracker.findAssignedAccountForTask(task.id);
    const assignedLabel = 'Назначена: ' + ((account !== null) ? account.login : '-');
    const descriptionLabel = 'Описание: ' + task.description ?? '-';
    const completedLabel = 'Завершена: ' + ((task.status === 'completed') ? 'Да' : 'Нет');

    return 'Задача #' + task.id + '. '
        + completedLabel + '. '
        + assignedLabel + '. '
        + descriptionLabel;
}

const runWithTask = async (callback) => {
    const tasks = await taskTracker.getAllTasks();
    const choices = [];

    for (const task of tasks) {
        choices.push({ name: await getTaskLabel(task), value: task });
    }

    const task = await ui.selectWithCancel('Выберите задачу', choices);

    if (task === '') {
        console.log('Задача не выбрана');

        return;
    }

    await callback(task);
}

const removeTask = async () => {
    await runWithTask(async (task) => {
        await taskTracker.removeTask(task.id);
        console.log('Задача удалена.');
    });
}

const completeTask = async () => {
    await runWithTask(async (task) => {
        await taskTracker.completeTask(task.public_id);
        console.log('Задача завершена.');
    });
}

const viewAllTasks = async () => {
    const tasks = await taskTracker.getAllTasks();

    for (const task of tasks) {
        console.log(await getTaskLabel(task));
    }
}

const assignAllTasks = async () => {
    await taskTracker.assignAllTasks();
    console.log('Все задачи были заассайнены.');
}

const menu = async () => {
    let running = true;

    while (running) {
        await ui.printHeader('Popug Task Tracker');

        const selectedAction = await ui.selectAction([
            'Список задач',
            'Создать задачу',
            'Удалить задачу',
            'Завершить задачу',
            'Заассайнить все задачи',
            ui.separator(),
            'Выход',
        ]);

        if (selectedAction === 'Список задач') {
            await viewAllTasks();
        }

        if (selectedAction === 'Создать задачу') {
            await createTask();
        }

        if (selectedAction === 'Удалить задачу') {
            await removeTask();
        }

        if (selectedAction === 'Завершить задачу') {
            await completeTask();
        }

        if (selectedAction === 'Заассайнить все задачи') {
            await assignAllTasks();
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

