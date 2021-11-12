const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return EventTracking.init(sequelize, DataTypes);
}

class EventTracking extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    consumer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_consumed_event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'event_tracking',
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
  return EventTracking;
  }
}
