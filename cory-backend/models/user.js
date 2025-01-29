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
      role: {
        type: DataTypes.ENUM('organizer', 'volunteer', 'staff'),
        allowNull: false,
        defaultValue: 'staff', // Default role is volunteer
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0, // Default rating
        validate: { min: 0, max: 5 }, // Ensure rating is between 0 and 5
      },
      usedLinks: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [], // Array to store IDs of links the user has clicked
        allowNull: false,
      },
    },
    {
      hooks: {
        // Automatically hash the password before creating a user
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
        // Automatically hash the password before updating a user
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password'] }, // Hide the password by default
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] }, // Include password when explicitly needed
        },
      },
    }
  );

  return User;
};