const sequelize = require('./../../../Common/Mysql/sequelize');
const publicId = require('./../../../Common/PublicId/public-id');

const createTask = async (title) => {
    return await sequelize.models.Task.create({
        public_id: publicId.generateId(),
        assigned_account_id: null,
        price: 0,
        status: 'open',
        title: title,
    });
}

const getTaskById = async (taskId) => {
    const record = await sequelize.models.Task.findOne({
        where: {
            id: taskId,
        }
    });

    if (record === null) {
        throw new Error('Not found task by ID');
    }

    return record;
}

const getTaskByPublicId = async (taskPublicId) => {
    const record = await sequelize.models.Task.findOne({
        where: {
            public_id: taskPublicId,
        }
    });

    if (record === null) {
        throw new Error('Not found task by Public ID');
    }

    return record;
}

const markTaskAsCompleted = async (taskId) => {
    await sequelize.models.Task.update({
        status: 'completed',
    }, {
        where: {
            id: taskId,
        }
    });
}

const findAllTasks = async () => {
    return await sequelize.models.Task.findAll();
}

const findAllOpenTasks = async () => {
    return await sequelize.models.Task.findAll({
        where: {
            status: 'open',
        }
    });
}

const assignTask = async (taskId, accountPublicId) => {
    await sequelize.models.Task.update({
        assigned_account_id: accountPublicId,
    }, {
        where: {
            id: taskId,
        }
    });
}

const removeTask = async (taskId) => {
    await sequelize.models.Task.destroy({
        where: {
            id: taskId,
        }
    });
}

module.exports = {
    createTask: createTask,
    getTaskById: getTaskById,
    getTaskByPublicId: getTaskByPublicId,
    markTaskAsCompleted: markTaskAsCompleted,
    findAllTasks: findAllTasks,
    findAllOpenTasks: findAllOpenTasks,
    assignTask: assignTask,
    removeTask: removeTask
}