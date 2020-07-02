/**
 * arquivo que processa as filas
 * chama o arquivo que chama o método que processa as filas
 */
require('dotenv/config');

const Queue = require('./lib/Queue');

Queue.processQueue();
