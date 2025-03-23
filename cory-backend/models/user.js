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
        type: DataTypes.STRING, // or TEXT if you expect long URLs
        allowNull: true,
      },
      
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // ✅ Ensures valid email format
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("organizer", "volunteer", "staff"),
        allowNull: false,
        defaultValue: "staff", // ✅ Default role is "staff"
        validate: {
          isIn: [["organizer", "volunteer", "staff"]], // ✅ Ensures only valid roles
        },
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0, // ✅ Default rating
        validate: {
          min: 0,
          max: 5, // ✅ Ensure rating is between 0 and 5
        },
      },
    },
    {
      hooks: {
        // ✅ Hash password before creating a user
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
        // ✅ Hash password only if it's changed during an update
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcryptjs.hash(user.password, 10);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ["password"] }, // ✅ Hide password in default queries
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] }, // ✅ Include password only when explicitly needed
        },
      },
    }
  );

  return User;
};
