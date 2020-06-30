/**
 * classe onde vai ser possível fazer o envio do email
 */
const nodemailer = require('nodemailer');
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
