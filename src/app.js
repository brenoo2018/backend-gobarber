// ARQUIVO ONDE FICA A CONFIGURAÇÃO DA ESTRUTURA DE PASTAS
const path = require('path');
const express = require('express');
const routes = require('./routes');

require('./database'); // carrega o arquivo de conexão

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

  middlewares() {
    /*
     * configura p/ receber requisições post em json
     */
    this.server.use(express.json());
    /*
     * configura p/ ler arquivos estáticos
     */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  /*
   * configura p/ usar as rotas do arquivo ./routes.js
   */
  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
