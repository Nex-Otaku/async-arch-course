var DataTypes = require("sequelize").DataTypes;
var _Account = require("./account");
var _EventTracking = require("./event_tracking");
var _Event = require("./event");
var _Task = require("./task");

function initModels(sequelize) {
  var Account = _Account(sequelize, DataTypes);
  var EventTracking = _EventTracking(sequelize, DataTypes);
  var Event = _Event(sequelize, DataTypes);
  var Task = _Task(sequelize, DataTypes);


  return {
    Account,
    EventTracking,
    Event,
    Task,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
