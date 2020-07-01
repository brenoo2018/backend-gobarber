const { format, parseISO } = require('date-fns');
const pt = require('date-fns/locale/pt');
const Mail = require('../../lib/Mail');

class CancellationMail {
  // retorna variável sem constructor que retorna uma chave única p/ cada JOB
  get key() {
    return 'CancellationMail';
  }

  /**
   * o que vai ser executado quando o processo for chamado
   */
  async handle({ data }) {
    const { appointment } = data; // recendo os dados do AppointmentController

    // console.log('fila executou');
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelation',
      /**
       * enviando variáveis que estão esperando ser recebidas nas views
       */
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM'/'yyyy', às' H:mm'h'",
          { locale: pt }
        ),
      },
    });
  }
}

module.exports = new CancellationMail();
