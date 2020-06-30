/**
 * classe onde vai ser possível fazer o envio do email
 */
const { resolve } = require('path');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const nodemailerhbs = require('nodemailer-express-handlebars');

const configMail = require('../config/configMail');

class Mail {
  constructor() {
    /**
     * no construtor passa as configurações de configMail
     */
    const { host, port, secure, auth } = configMail;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // algumas estratégias de envio de email não possui autenticação
    });

    this.configureTemplates();
  }

  /**
   * método que configura o template engine passando o caminho das views
   */
  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  /**
   * método que envia o email com o remetente padrão e a mensagem
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...configMail.default,
      ...message,
    });
  }
}

module.exports = new Mail();
