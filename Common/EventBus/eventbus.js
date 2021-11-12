const eventStorage = require('./storage/events-storage');
const eventTrackingStorage = require('./storage/event-tracking-storage');

const postEvent = async (event) => {
    console.log('Событие создано', event);
    await eventStorage.addEvent(event);
}

const readEventByTopic = async (topic, consumer) => {
    console.log('Консюмер "' + consumer + '" запросил событие по топику "' + topic + '"');
    const lastConsumedEventId = await eventTrackingStorage.getLastConsumedEventId(topic, consumer);

    return await eventStorage.readEventAfter(lastConsumedEventId, topic);
}

const markEventAsConsumed = async (eventId, topic, consumer) => {
    console.log('Событие обработано консюмером "' + consumer + '"');
    await eventTrackingStorage.markConsumedEvent(eventId, topic, consumer);
}

module.exports = {
    postEvent: postEvent,
    readEventByTopic: readEventByTopic,
    markEventAsConsumed: markEventAsConsumed,
}