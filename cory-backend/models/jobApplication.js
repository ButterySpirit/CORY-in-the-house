module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define("JobApplication", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
        allowNull: false
      }
    });
  
    JobApplication.associate = (models) => {
      JobApplication.belongsTo(models.User, { foreignKey: "userId" });
      JobApplication.belongsTo(models.JobPosting, { foreignKey: "jobPostingId" });
    };
  
    return JobApplication;
  };
  