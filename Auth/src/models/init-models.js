var DataTypes = require("sequelize").DataTypes;
var _Account = require("./account");
var _EventTracking = require("./event_tracking");
var _Event = require("./event");
var _Token = require("./token");

function initModels(sequelize) {
  var Account = _Account(sequelize, DataTypes);
  var EventTracking = _EventTracking(sequelize, DataTypes);
  var Event = _Event(sequelize, DataTypes);
  var Token = _Token(sequelize, DataTypes);


  return {
    Account,
    EventTracking,
    Event,
    Token,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
