module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    Event.associate = (models) => {
      Event.belongsTo(models.User, { foreignKey: "organizerId", onDelete: "CASCADE" });
      Event.hasMany(models.JobPosting, { foreignKey: "eventId", onDelete: "CASCADE" });
    };
  
    return Event;
  };
  