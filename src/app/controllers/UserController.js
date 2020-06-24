const User = require('../models/User');

class UserController {
  async store(req, res) {
    /**
     * Verificando se já existe um usuário com o mesmo email
     */
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Email já existente' });
    }

    /**
     * inserindo usuário no banco
     */

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    console.log(req.userId);
    return res.json({ ok: true });
  }
}

module.exports = new UserController();
