const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('../models/User');
const configAuth = require('../../config/configAuth');

class SessionController {
  async store(req, res) {
    /**
     * Início validação da entrada de dados
     */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }
    /**
     * Fim validação da entrada de dados
     */

    const { email, password } = req.body;

    /**
     * verifica se existe usuário
     */
    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }

    /**
     * verifica se a senha usada p/ logar é a mesma do banco de dados
     */
    if (!(await userExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name } = userExists;

    /**
     * retorna os dados do usuário juntamente com o token de autenticação
     */
    return res.json({
      user: {
        id,
        name,
        email,
      },
      /**
       * 1 parâmetro - objeto payload com os dados
       * 2 parâmetro - hash aleatório https://www.md5online.org/
       * 3 parâmetro - tempo de expiração
       */
      token: jwt.sign({ id }, configAuth.secret, {
        expiresIn: configAuth.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
