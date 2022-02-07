"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      models.Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
      models.Message.hasMany(models.Comment);
    }
  }
  Message.init(
    {
      UserId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
