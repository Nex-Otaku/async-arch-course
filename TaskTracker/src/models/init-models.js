var DataTypes = require("sequelize").DataTypes;
var _Task = require("./task");

function initModels(sequelize) {
  var Task = _Task(sequelize, DataTypes);


  return {
    Task,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
