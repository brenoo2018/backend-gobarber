/* eslint-disable camelcase */
const Yup = require('yup');
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

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    res.json(appointment);
  }
}

module.exports = new AppointmentController();
