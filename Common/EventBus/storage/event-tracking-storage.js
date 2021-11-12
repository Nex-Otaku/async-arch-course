const findTrackingRecord = async (topic, consumer) => {
    return await sequelize.models.EventTracking.findOne({
        where: {
            topic: topic,
            consumer: consumer,
        }
    });
}

const getLastConsumedEventId = async (topic, consumer) => {
    const record = findTrackingRecord(topic, consumer);

    if (record === null) {
        return 0;
    }

    return record.last_consumed_event_id;
}

const markConsumedEvent = async (eventId, topic, consumer) => {
    const record = findTrackingRecord(topic, consumer);

    if (record === null) {
        await sequelize.models.EventTracking.create({
            topic: topic,
            consumer: consumer,
            last_consumed_event_id: eventId,
        });

        return;
    }

    await sequelize.models.EventTracking.update({
        last_consumed_event_id: eventId,
    }, {
        where: {
            id: record.id,
        }
    });
}

module.exports = {
    getLastConsumedEventId: getLastConsumedEventId,
    markConsumedEvent: markConsumedEvent,
}