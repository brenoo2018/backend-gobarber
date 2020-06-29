// ARQUIVO ONDE FICA TODAS AS ROTAS DA APLICAÇÃO

const { Router } = require('express');

const multer = require('multer');
const configMulter = require('./config/configMulter');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const ProviderController = require('./app/controllers/ProviderController');
const AppointmentController = require('./app/controllers/AppointmentController');

const authMiddleware = require('./app/middlewares/authMiddleware');

const routes = new Router();
const uploads = multer(configMulter);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/appointments', AppointmentController.store);

routes.post('/files', uploads.single('file'), FileController.store);

module.exports = routes;
