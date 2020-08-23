const Yup = require('yup');
const User = require('../models/User');
const File = require('../models/File');

class UserController {
  async store(req, res) {
    /**
     * Início validação da entrada de dados
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }
    /**
     * Fim validação da entrada de dados
     */

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
    /**
     * Início validação da entrada de dados
     */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // condição p/ o campo password ser obrigatório se informado oldPassword
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // condição p/ o campo confirmPassword ser igual ao password
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }
    /**
     * Fim validação da entrada de dados
     */

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

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

module.exports = new UserController();
