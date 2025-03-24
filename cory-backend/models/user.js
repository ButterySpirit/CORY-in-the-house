const bcryptjs = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("organizer", "volunteer", "staff"),
        allowNull: false,
        defaultValue: "staff",
        validate: {
          isIn: [["organizer", "volunteer", "staff"]],
        },
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );

  // ✅ Add association here
  User.associate = function (models) {
    User.hasMany(models.Message, {
      foreignKey: "senderId",
    });
  };

  return User;
};
