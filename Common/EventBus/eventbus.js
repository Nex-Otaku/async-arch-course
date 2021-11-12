const eventStorage = require('./storage/events-storage');
const eventTrackingStorage = require('./storage/event-tracking-storage');

const postEvent = async (event) => {
    console.log('Event was produced', event);
    await eventStorage.addEvent(event);
}

const readEventByTopic = async (topic, consumer) => {
    console.log('Consumer "' + consumer + '" asks for events on topic "' + topic + '"');
    const lastConsumedEventId = await eventTrackingStorage.getLastConsumedEventId(topic, consumer);

    return await eventStorage.readEventAfter(lastConsumedEventId, topic);
}

const markEventAsConsumed = async (eventId, topic, consumer) => {
    console.log('Event was consumed by consumer "' + consumer + '"');
    await eventTrackingStorage.markConsumedEvent(eventId, topic, consumer);
}

module.exports = {
    postEvent: postEvent,
    readEventByTopic: readEventByTopic,
    markEventAsConsumed: markEventAsConsumed,
}