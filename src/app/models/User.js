const { Model } = require('sequelize');
const Sequelize = require('sequelize');

/**
 * Criar model do banco de dados evitando as colunas que sao PK, FK, created, updated
 */
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = User;
