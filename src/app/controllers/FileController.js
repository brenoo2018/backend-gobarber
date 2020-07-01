const File = require('../models/File');

class FileController {
  async store(req, res) {
    /**
     * pega o originalname e filename de req.file e envia p/ as variáveis que é esperadas no banco
     */
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

module.exports = new FileController();
