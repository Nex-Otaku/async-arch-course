const environment = require('./../Env/environment');
const { v4: uuidv4 } = environment.require('uuid');

const generateId = () => {
    return uuidv4();
}

module.exports = {
    generateId: generateId
}