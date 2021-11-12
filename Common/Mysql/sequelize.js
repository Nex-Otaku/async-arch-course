const environment = require('./../Env/environment');
const { Sequelize, Op } = environment.require('sequelize');
const initModels = require(environment.getRootServicePath() + '/src/models/init-models');

const database = environment.get().MYSQL_DB;
const user = environment.get().MYSQL_USER;
const password = environment.get().MYSQL_PASSWORD;
const host = environment.get().MYSQL_HOST;
const port = environment.get().MYSQL_PORT;

const logging = false;

let sequelize = new Sequelize(database, user, password, {
	host,
	port,
	dialect: 'mysql',
	logging: logging ? console.log : false,
	pool: {
		max: 5, //максимальное кол-во соединений в пуле (Default: 5)
		min: 0, //минимальное кол-во соединений в пуле (Default: 0)
		acquire: 3000, //время в миллисекундах, в течение которого будет осуществляться попытка установить соединение, прежде чем будет сгенерировано исключение (Default: 60000)
		idle: 10000, //время в миллисекундах, после которого соединение помечается как неактивное
		evict: 6000, //время простоя в миллисекундах, по истечении которого соединение покинет пул (Default: 1000)
	},
});

const models = initModels(sequelize);

const log = (message) => {
	if (!logging) {
		return;
	}

	console.log(message);
}

const pingConnection = async () => {
	if (sequelize === null) {
		return;
	}

	log('Pinging database connection...');
	await sequelize.query('SELECT 1');
	log('Database connection pinged and is alive.');
}

let ping = null;

const keepAlive = () => {
	ping = setInterval(async () => {
		await pingConnection();
	}, 1000);
}

const stop = () => {
	if (ping === null) {
		return;
	}

	clearInterval(ping);
}

const getConnection = () => {
	return sequelize;
}

const closeConnection = async () => {
	if (sequelize === null) {
		return;
	}

	stop();
	await sequelize.close();
	sequelize = null;
}

const nowSql = () => {
	return Sequelize.literal('NOW()');
}

/**
 * https://sequelize.org/master/manual/model-querying-basics.html#applying-where-clauses
 *
 where: {
            topic: topic,
            id: {
                [sequelize.op().gt]: eventId
            }
        }
 * @returns {*}
 */
const op = () => {
	return Op;
}

keepAlive();

module.exports = {
	getConnection: getConnection,
	models: models,
	keepAlive: keepAlive,
	close: closeConnection,
	nowSql: nowSql,
	op: op,
}