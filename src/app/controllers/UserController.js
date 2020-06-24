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
    const { email, oldPassword } = req.body;

    // pesquisa o usuário pela primary key
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      /**
       * Verificando se já existe um usuário com o mesmo email
       */
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Email já existente.' });
      }
    }

    /**
     * Só altera a senha se informar a senha antiga.
     */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

module.exports = new UserController();
