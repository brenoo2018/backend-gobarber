/**
 * Controller p/ o prestador de serviços logado listar os agendamentos do dia
 */

const { startOfDay, endOfDay, parseISO } = require('date-fns');
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    /**
     * verifica se o usuário é um prestador de serviço
     */

    if (!checkUserProvider) {
      return res.status(401).json({
        error: 'O usuário não é um prestador de serviços',
      });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);
    // console.log(parsedDate);

    /**
     * listando todos os agendamentos em que o usuário logado é um prestador de serviço
     * que os agendamentos não estão cancelados e que a data esteja entre o começo e o final do dia atual
     */

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments);
  }
}

module.exports = new ScheduleController();
