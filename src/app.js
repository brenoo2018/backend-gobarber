// ARQUIVO ONDE FICA A CONFIGURAÇÃO DA ESTRUTURA DE PASTAS

const path = require('path');
const Youch = require('youch'); // biblioteca p/ tratamento de exceções
const Sentry = require('@sentry/node'); // biblioteca p/ monitoramento de erros
const express = require('express');

// tem que ser importado antes das rotas
require('express-async-errors');
const routes = require('./routes');

const configSentry = require('./config/configSentry');

require('./database'); // carrega o arquivo de conexão

class App {
  constructor() {
    // inicializa a varirável server p/ receber a instancia do express
    this.server = express();

    // inicialzia sentry p/ exceções
    Sentry.init(configSentry);

    /**
     * chamando os métodos p/ ser instanciado no construtor;
     */
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());

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
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /**
   * middleware de tratamento de exceções
   */

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      res.status(500).json(errors);
    });
  }
}

module.exports = new App().server;
