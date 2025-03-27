"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // 🔹 Users
    const organizer1 = "11111111-1111-1111-1111-111111111111";
    const staff1     = "22222222-2222-2222-2222-222222222221";
    const volunteer1 = "33333333-3333-3333-3333-333333333331";

    const messages = [
      // 🔸 Organizer ↔ Staff
      {
        id: uuidv4(),
        roomId: `direct__${organizer1}__${staff1}`,
        senderId: organizer1,
        receiverId: staff1,
        content: "Hey staff1, can you help with sound check tonight?",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        roomId: `direct__${organizer1}__${staff1}`,
        senderId: staff1,
        receiverId: organizer1,
        content: "Sure thing! I’ll be there by 6pm.",
        createdAt: new Date(now.getTime() + 1000),
        updatedAt: new Date(now.getTime() + 1000),
      },

      // 🔸 Organizer ↔ Volunteer
      {
        id: uuidv4(),
        roomId: `direct__${organizer1}__${volunteer1}`,
        senderId: organizer1,
        receiverId: volunteer1,
        content: "Hi volunteer1, can you handle check-in at the door?",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        roomId: `direct__${organizer1}__${volunteer1}`,
        senderId: volunteer1,
        receiverId: organizer1,
        content: "Yes, I’m happy to help with that!",
        createdAt: new Date(now.getTime() + 1000),
        updatedAt: new Date(now.getTime() + 1000),
      }
    ];

    return queryInterface.bulkInsert("messages", messages);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("messages", null, {});
  },
};
