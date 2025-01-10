module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'usedLinks', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      defaultValue: [],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'usedLinks');
  },
};
