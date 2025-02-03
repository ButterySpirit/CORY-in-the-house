module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define("JobApplication", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      jobPostingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "JobPostings", key: "id" },
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
      resume: {
        type: DataTypes.STRING, // ✅ Stores resume file path
        allowNull: true, // ✅ Nullable for volunteers
      },
    });
  
    JobApplication.associate = (models) => {
      JobApplication.belongsTo(models.User, { foreignKey: "userId" });
      JobApplication.belongsTo(models.JobPosting, { foreignKey: "jobPostingId" });
    };
  
    return JobApplication;
  };
  