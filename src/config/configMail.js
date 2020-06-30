/**
 * Configuração do mailtrap.io p/ ambiente de desenvolvimento
 */
module.exports = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'ac837395e2fb08',
    pass: '50e9ce809fc928',
  },
  default: {
    from: 'Equipe <noreply@gobarber.com>', // remetente padrão
  },
};
