const { Model } = require('sequelize');
const Sequelize = require('sequelize');

/**
 * Criar model do banco de dados colocando apenas as colunas que o usuário irá preencher
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
