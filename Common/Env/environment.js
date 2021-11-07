let loaded = false;

if (!loaded) {
    loaded = true;
    require('dotenv').config({path: process.env.PWD + '/.env'});
}

const get = () => {
    return process.env;
}

module.exports = {
    get: get
};