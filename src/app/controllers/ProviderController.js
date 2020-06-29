const User = require('../models/User');
const File = require('../models/File');

class ProviderController {
  async index(req, res) {
    const provider = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // incluir o relacionamento
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: [['id', 'desc']],
    });

    res.json(provider);
  }
}

module.exports = new ProviderController();
