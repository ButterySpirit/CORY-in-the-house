"use strict";

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const jobPostings = await queryInterface.sequelize.query(
      `SELECT id, role FROM "JobPostings";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const staffUserIds = [
      "55555555-5555-5555-5555-555555555555",
      "55555555-5555-5555-5555-555555555556",
      "55555555-5555-5555-5555-555555555557",
    ];

    const volunteerUserIds = [
      "66666666-6666-6666-6666-666666666666",
      "66666666-6666-6666-6666-666666666667",
      "66666666-6666-6666-6666-666666666668",
    ];

    const applications = jobPostings.map((job, index) => {
      const userPool = job.role === "staff" ? staffUserIds : volunteerUserIds;
      const userId = userPool[index % userPool.length];

      return {
        id: `app-${(index + 1).toString().padStart(3, "0")}`,
        jobPostingId: job.id,
        userId,
        status: "pending",
        resume: job.role === "staff" ? `/uploads/resumes/resume-${index + 1}.pdf` : null,
        createdAt: now,
        updatedAt: now,
      };
    });

    return queryInterface.bulkInsert("JobApplications", applications);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("JobApplications", null, {});
  },
};