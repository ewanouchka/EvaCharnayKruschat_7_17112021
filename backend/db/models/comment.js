"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
      models.Comment.belongsTo(models.Message, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Comment.init(
    {
      UserId: DataTypes.INTEGER,
      MessageId: DataTypes.INTEGER,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
