const readSchemaFile = async (name, version) => {
    // TODO
}

const validateSchema = (data, schema) => {
    // TODO
}

const validateEvent = async (event, name, version) => {
    if (event.name !== name) {
        return false;
    }

    if (event.version !== version) {
        return false;
    }

    const schemaFile = await readSchemaFile(name, version);

    return validateSchema(event, schemaFile);
}

module.exports = {
    validateEvent: validateEvent,
}