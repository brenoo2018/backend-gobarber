/* eslint-disable camelcase */
const Yup = require('yup');
const { startOfHour, parseISO, isBefore } = require('date-fns');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const File = require('../models/File');

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
      return res
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
      return res.status(400).json({ error: 'Não há vagas neste horário' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query; // pega a paginação pelo query params

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20, // limitar registros
      offset: (page - 1) * 20, // informar de quanto em quanto quer pular
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }
}

module.exports = new AppointmentController();
