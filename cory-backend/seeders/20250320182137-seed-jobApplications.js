"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    const staffUserIds = [
      "22222222-2222-2222-2222-222222222221",
      "22222222-2222-2222-2222-222222222222",
      "22222222-2222-2222-2222-222222222223",
    ];

    const volunteerUserIds = [
      "33333333-3333-3333-3333-333333333331",
      "33333333-3333-3333-3333-333333333332",
      "33333333-3333-3333-3333-333333333333",
    ];

    // 🔹 Get all job postings
    const jobPostings = await queryInterface.sequelize.query(
      `SELECT id, role FROM "JobPostings";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const jobApplications = jobPostings.map((job, index) => {
      const userId =
        job.role === "staff"
          ? staffUserIds[index % staffUserIds.length]
          : volunteerUserIds[index % volunteerUserIds.length];

      return {
        id: uuidv4(),
        jobPostingId: job.id,
        userId,
        status: "pending",
        resume: null,
        createdAt: now,
        updatedAt: now,
      };
    });

    return queryInterface.bulkInsert("JobApplications", jobApplications);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("JobApplications", null, {});
  },
};