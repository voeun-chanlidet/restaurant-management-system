"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "payments",
      "amount_tendered",
      "cash_received",
    );
    await queryInterface.renameColumn("payments", "change", "change_amount");

    await queryInterface.changeColumn("payments", "cash_received", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn("payments", "change_amount", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("payments", "total_currency", {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    });
    await queryInterface.addColumn("payments", "payment_currency", {
      type: Sequelize.STRING(3),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "change_currency", {
      type: Sequelize.STRING(3),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "exchange_rate", {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
    });

    await queryInterface.removeColumn("payments", "cash_received_usd");
    await queryInterface.removeColumn("payments", "cash_received_khr");
    await queryInterface.removeColumn("payments", "change_usd");
    await queryInterface.removeColumn("payments", "change_khr");
    await queryInterface.removeColumn("payments", "display_currency");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("payments", "cash_received_usd", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "cash_received_khr", {
      type: Sequelize.DECIMAL(12, 0),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "change_usd", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "change_khr", {
      type: Sequelize.DECIMAL(12, 0),
      allowNull: true,
    });
    await queryInterface.addColumn("payments", "display_currency", {
      type: Sequelize.STRING(3),
      allowNull: true,
    });

    await queryInterface.removeColumn("payments", "total_currency");
    await queryInterface.removeColumn("payments", "payment_currency");
    await queryInterface.removeColumn("payments", "change_currency");
    await queryInterface.removeColumn("payments", "exchange_rate");

    await queryInterface.changeColumn("payments", "cash_received", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn("payments", "change_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.renameColumn(
      "payments",
      "cash_received",
      "amount_tendered",
    );
    await queryInterface.renameColumn("payments", "change_amount", "change");
  },
};
