"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const roles = ["staff", "volunteer"];
    const jobPostings = [];

    const eventIds = [
      // Organizer 1
      "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",

      // Organizer 2
      "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb",

      // Organizer 3
      "ccccccc1-cccc-cccc-cccc-cccccccccccc",
      "ccccccc2-cccc-cccc-cccc-cccccccccccc",
      "ccccccc3-cccc-cccc-cccc-cccccccccccc",
    ];

    eventIds.forEach((eventId) => {
      roles.forEach((role) => {
        jobPostings.push({
          id: uuidv4(),
          title: role === "staff" ? "Sound Tech Assistant" : "Flyer Distributor",
          description:
            role === "staff"
              ? "Assist the audio engineer with equipment setup and sound check."
              : "Help hand out flyers and wristbands at the entrance.",
          eventId,
          role,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    return queryInterface.bulkInsert("JobPostings", jobPostings);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("JobPostings", null, {});
  },
};
