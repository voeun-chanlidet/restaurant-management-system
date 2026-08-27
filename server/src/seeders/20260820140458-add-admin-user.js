"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin",
          email: "admin@rms.com",
          // Pre-hashed string for password: password123
          password:
            "$2a$10$S1NU2FcA8PWHCSPWlpqPse5JB49WcYvfZ7qs9K.PIrLDijDMh6PRG",
          role: "ADMIN",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@rms.com" }, {});
  },
};
