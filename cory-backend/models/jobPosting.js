module.exports = (sequelize, DataTypes) => {
    const JobPosting = sequelize.define("JobPosting", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("volunteer", "staff"),
        allowNull: false,
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Events",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  
    JobPosting.associate = (models) => {
      JobPosting.belongsTo(models.Event, { foreignKey: "eventId" });
    };
  
    return JobPosting;
  };
  