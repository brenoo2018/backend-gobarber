const { Model, ...Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

/**
 * Criar model do banco de dados colocando apenas as colunas que o usuário irá preencher
 */
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // campo que não existe no bd
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    /**
     * hook que é disparado antes de salvar no banco
     * 1 parâmetro - funcao hook
     * 2 parâmetro - model
     */
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    /**
     * este model de usuário, pertence a um model de file na coluna referenciada com o apelido de avatar
     */
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  /**
   * compara a senha que o usuário está inserindo com a senha do BD
   */

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
