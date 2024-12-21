const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumpHeight: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10); // Hash password before saving
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10); // Hash password before updating
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password'] }, // Exclude password in responses by default
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
    }
  );

  return User;
};
