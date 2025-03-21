"use strict";

const bcrypt = require("bcryptjs");

const now = new Date();

const makeUser = async (id, username, email, role) => ({
  id,
  username,
  email,
  password: await bcrypt.hash("password123", 10),
  role,
  createdAt: now,
  updatedAt: now,
});

module.exports = {
  up: async (queryInterface) => {
    const users = await Promise.all([
      makeUser("11111111-1111-1111-1111-111111111111", "organizer1", "organizer1@example.com", "organizer"),
      makeUser("11111111-1111-1111-1111-111111111112", "organizer2", "organizer2@example.com", "organizer"),
      makeUser("11111111-1111-1111-1111-111111111113", "organizer3", "organizer3@example.com", "organizer"),

      makeUser("22222222-2222-2222-2222-222222222221", "staff1", "staff1@example.com", "staff"),
      makeUser("22222222-2222-2222-2222-222222222222", "staff2", "staff2@example.com", "staff"),
      makeUser("22222222-2222-2222-2222-222222222223", "staff3", "staff3@example.com", "staff"),

      makeUser("33333333-3333-3333-3333-333333333331", "volunteer1", "volunteer1@example.com", "volunteer"),
      makeUser("33333333-3333-3333-3333-333333333332", "volunteer2", "volunteer2@example.com", "volunteer"),
      makeUser("33333333-3333-3333-3333-333333333333", "volunteer3", "volunteer3@example.com", "volunteer"),
    ]);

    return queryInterface.bulkInsert("Users", users);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
