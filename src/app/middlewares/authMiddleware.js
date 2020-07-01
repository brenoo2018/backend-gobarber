const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const configAuth = require('../../config/configAuth');

module.exports = async (req, res, next) => {
  /**
   * pegando o token de autenticação do header;
   */
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não encontrado.' });
  }

  /**
   * desestruturando o array pra pegar a segunda posição onde fica o token
   */
  const [, token] = authHeader.split(' ');

  try {
    /**
     * transforma a função verify pra usar o async/await
     */
    const decoded = await promisify(jwt.verify)(token, configAuth.secret);

    /**
     * envia o token na variável userId pela requisição p/ que possa ser usada
     */
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
