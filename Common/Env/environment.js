const rootServicePath = process.env.PWD;

const requireModule = (name) => {
    return require(rootServicePath + '/node_modules/' + name);
}

let loaded = false;

if (!loaded) {
    loaded = true;
    requireModule('dotenv').config({path: rootServicePath + '/.env'});
}

const get = () => {
    return process.env;
}

const getRootServicePath = () => {
    return rootServicePath;
}

module.exports = {
    get: get,
    require: requireModule,
    getRootServicePath: getRootServicePath,
};