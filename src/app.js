// ARQUIVO ONDE FICA A CONFIGURAÇÃO DA ESTRUTURA DE PASTAS

const express = require('express');
const routes = require('./routes');

class App {
  constructor() {
    // inicializa a varirável server p/ receber a instancia do express
    this.server = express();

    /**
     * chamando os métodos p/ ser instanciado no construtor;
     */
    this.middlewares();
    this.routes();
  }

  /*
   * configura p/ receber requisições post em json
   */
  middlewares() {
    this.server.use(express.json());
  }

  /*
   * configura p/ usar as rotas do arquivo ./routes.js
   */
  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
