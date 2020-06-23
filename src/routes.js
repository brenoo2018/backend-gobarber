// ARQUIVO ONDE FICA TODAS AS ROTAS DA APLICAÇÃO

const { Router } = require('express');
const User = require('./app/models/User');

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Breno',
    email: 'breno@breno.com',
    password_hash: '123456',
  });

  return res.json(user);
});

module.exports = routes;
