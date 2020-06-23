/**
 * arquivo que realiza a conexão com o banco de dados e carrega os models
 */

const Sequelize = require('sequelize');

const User = require('../app/models/User');

const configDatabase = require('../config/configDatabase');

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // insere na variável de conexão as configurações de conexão do sequelize
    this.connection = new Sequelize(configDatabase);

    /**
     * no metodo init de cada model, eles esperam a conexão com o banco de dados,
     * percorre cada model e envia a conexão;
     */
    models.map((model) => model.init(this.connection));
  }
}

module.exports = new Database();
