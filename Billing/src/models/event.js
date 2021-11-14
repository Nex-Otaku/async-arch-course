const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Event.init(sequelize, DataTypes);
}

class Event extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    event: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'events',
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
  return Event;
  }
}
