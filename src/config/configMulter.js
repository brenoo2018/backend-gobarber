// ARQUIVO CONFIGURAÇÃO INICIAL MULTER

const multer = require('multer');
const crypto = require('crypto');
const { extname, resolve } = require('path');

module.exports = {
  /**
   * multer recebe o local do arquivo e nome do arquivo
   */
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /**
     * p/ formular o nome do arquivo usa-se o crypto p/ deixar com nome único + extensão
     */
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
