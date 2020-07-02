/**
 * controller p/ listar os horarios disponíveis pra agendamento de um determinado prestador de serviço
 * no intervalo de um dia
 */
const {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} = require('date-fns');
const { Op } = require('sequelize');

const Appointment = require('../models/Appointment');

class AvailableController {
  async index(req, res) {
    const { providerId } = req.params;
    const { date } = req.query;

    /**
     * Verifica se informou a data
     */

    if (!date) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    const searchDate = Number(date);
    // console.log(searchDate);

    /**
     * listandoa agendamentos do dia atual
     */

    const appointments = await Appointment.finddAll({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    /**
     * horários que o prestador de serviço atende
     */

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    /**
     * percorre o vetor separa as horas e minutos e formata p/ o padrão timezone
     */

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      /**
       * retorna o horário, horário formatado em timezone e se o horário está disponível
       */

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find((ap) => format(ap.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

module.exports = new AvailableController();
