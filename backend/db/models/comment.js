"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "CASCADE",
        hooks: true,
      });
      models.Comment.belongsTo(models.Message, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Comment.init(
    {
      UserId: DataTypes.INTEGER,
      MessageId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
