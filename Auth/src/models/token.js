const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Token.init(sequelize, DataTypes);
}

class Token extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tokens',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Token;
  }
}
