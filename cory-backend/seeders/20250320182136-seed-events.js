"use strict";

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    return queryInterface.bulkInsert("Events", [
      // Organizer 1
      {
        id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        title: "Sunset Techno Rave",
        description: "Dance to deep techno under the fading sun with top DJs.",
        date: "2025-04-01",
        location: "Warehouse District",
        organizerId: "11111111-1111-1111-1111-111111111111",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        title: "Basement Basslines",
        description: "Underground vibes and vinyl-only house sets.",
        date: "2025-04-10",
        location: "The Subroom",
        organizerId: "11111111-1111-1111-1111-111111111111",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        title: "Modular Nights",
        description: "A synth-heavy experience showcasing live modular performances.",
        date: "2025-04-20",
        location: "Analog Lab",
        organizerId: "11111111-1111-1111-1111-111111111111",
        createdAt: now,
        updatedAt: now,
      },

      // Organizer 2
      {
        id: "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        title: "Progressive Pulse",
        description: "Melodic techno meets progressive house in an immersive light show.",
        date: "2025-04-02",
        location: "Lumen Club",
        organizerId: "11111111-1111-1111-1111-111111111112",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        title: "All Night Trance",
        description: "Classic trance reunion with legendary 90s DJs.",
        date: "2025-04-12",
        location: "Pulse Arena",
        organizerId: "11111111-1111-1111-1111-111111111112",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        title: "Afterhours Industry Mixer",
        description: "Connect with DJs, VJs, promoters and crew after the rave.",
        date: "2025-04-22",
        location: "Backstage Lounge",
        organizerId: "11111111-1111-1111-1111-111111111112",
        createdAt: now,
        updatedAt: now,
      },

      // Organizer 3
      {
        id: "ccccccc1-cccc-cccc-cccc-cccccccccccc",
        title: "Boiler Beats",
        description: "Raw unfiltered techno broadcasted live in a tight venue.",
        date: "2025-04-03",
        location: "Boiler Room",
        organizerId: "11111111-1111-1111-1111-111111111113",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "ccccccc2-cccc-cccc-cccc-cccccccccccc",
        title: "Vinyl & Vibes",
        description: "A tribute to analog DJing and crate diggers.",
        date: "2025-04-13",
        location: "Vinyl Social",
        organizerId: "11111111-1111-1111-1111-111111111113",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "ccccccc3-cccc-cccc-cccc-cccccccccccc",
        title: "Tech-House Takeover",
        description: "Groovy tech house party with rising stars of the scene.",
        date: "2025-04-23",
        location: "Groove Tunnel",
        organizerId: "11111111-1111-1111-1111-111111111113",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Events", null, {});
  },
};