/**
 * Configuração do mailtrap.io p/ ambiente de desenvolvimento
 */
module.exports = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe <noreply@gobarber.com>', // remetente padrão
  },
};
