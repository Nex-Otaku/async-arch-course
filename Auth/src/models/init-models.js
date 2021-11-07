var DataTypes = require("sequelize").DataTypes;
var _Account = require("./account");
var _Token = require("./token");

function initModels(sequelize) {
  var Account = _Account(sequelize, DataTypes);
  var Token = _Token(sequelize, DataTypes);


  return {
    Account,
    Token,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
