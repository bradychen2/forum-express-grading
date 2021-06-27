'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Followships',
        [{
          followerId: 2,
          followingId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          followerId: 3,
          followingId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }])
    } catch (err) {
      console.log(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
