"use strict";

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users", // assumes Users table exists
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "messages", // ✅ Match the existing table name in your DB
    }
  );

  Message.associate = function (models) {
    Message.belongsTo(models.User, { foreignKey: "senderId" });
  };

  return Message;
};
