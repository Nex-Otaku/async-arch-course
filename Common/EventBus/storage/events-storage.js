const sequelize = require('./../../../Common/Mysql/sequelize');

const addEvent = async (event) => {
    await sequelize.models.Event.create({
        topic: event.topic,
        event: event,
    });
}

const readEventAfter = async (eventId, topic) => {
    const record = await sequelize.models.Event.findOne({
        where: {
            topic: topic,
            id: {
                [sequelize.op().gt]: eventId
            }
        }
    });

    if (record === null) {
        return null;
    }

    return {...record.event, ...{id: record.id}};
}

module.exports = {
    addEvent: addEvent,
    readEventAfter: readEventAfter,
}