/* eslint-disable camelcase */
const Yup = require('yup');
const { startOfHour, parseISO, isBefore } = require('date-fns');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

class AppointmentController {
  async store(req, res) {
    /**
     * Início validação
     */
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Falha na validação' });
    }
    /**
     * Fim validação
     */

    const { provider_id, date } = req.body;

    /**
     * verificando se o usuário que está passando é um provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      res.status(401).json({
        error: 'O usuário selecionado não é um prestador de serviços',
      });
    }

    /**
     * pegando o início da hora enviada e verificando se a data do agendamento é uma data passada
     */

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      res
        .status(400)
        .json({ error: 'Não é permitido datas anteriores da data atual' });
    }

    /**
     * verificando se já tem agendamento na mesma data e horário
     */

    const checkAvailable = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });

    if (checkAvailable) {
      res.status(400).json({ error: 'Não há vagas neste horário' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    res.json(appointment);
  }
}

module.exports = new AppointmentController();
