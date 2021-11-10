var DataTypes = require("sequelize").DataTypes;
var _Account = require("./account");
var _Task = require("./task");

function initModels(sequelize) {
  var Account = _Account(sequelize, DataTypes);
  var Task = _Task(sequelize, DataTypes);


  return {
    Account,
    Task,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
