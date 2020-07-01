/* eslint-disable camelcase */

/**
 * Controller p/ o usuário criar seus agendamentos, listar e cancelar
 */
const Yup = require('yup');
const {
  startOfHour,
  parseISO,
  isBefore,
  format,
  subHours,
} = require('date-fns');
const pt = require('date-fns/locale/pt');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const File = require('../models/File');
const Notification = require('../schemas/Notification');
const CancellationMail = require('../jobs/CancellationMail');
const Queue = require('../../lib/Queue');

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
      return res.status(400).json({ error: 'Falha na validação' });
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
      return res.status(401).json({
        error: 'O usuário selecionado não é um prestador de serviços',
      });
    }

    if (isProvider.id === req.userId) {
      return res.status(401).json({
        error: 'Não é permitido agendar um horário pra você mesmo',
      });
    }

    /**
     * pegando o início da hora enviada e verificando se a data do agendamento é uma data passada
     * parseISO transforma a data inserida em um objeto javascript
     * ex: se a hr inserida for assim 2020-07-01T07:00-03:00 ele ficará assim -> 2020-07-01T10:00:00.000Z
     */

    const hourStart = startOfHour(parseISO(date));
    // console.log(hourStart);
    // console.log(date);

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Não é permitido datas anteriores da data atual' });
    }

    /**
     * verificando se já tem agendamento na mesma data e horário e com o mesmo prestador
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

    /**
     * Notificar prestador de serviço
     */

    const user = await User.findByPk(req.userId);

    /**
     * formata a data inserida
     */

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM'/'yyyy', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
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
          // inclui o model de usuário que está relacionado com o agendamento
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // inclui o model de file(avatar) que está relacionado com o usuário
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

  async delete(req, res) {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      // trás os dados do prestador de serviço p/ ser enviado no email
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        // trás os dados do usuário p/ ser enviado no email
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Você só pode cancelar o agendamento do seu usuário' });
    }

    /**
     * subtrai a hora marcada por 2 e verifica se está no intervalo p/ poder cancelar
     */

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error:
          'Não é permitido cancelar o agendamento faltando 2 horas pro horário marcado',
      });
    }

    /**
     * verifica se o agendamento já foi cancelado
     */

    if (appointment.canceled_at) {
      return res.status(401).json({
        error: 'Agendamento já cancelado',
      });
    }

    /**
     * cancela o agendamento e libera o horário
     */

    appointment.canceled_at = new Date();

    await appointment.save();

    /**
     * Envia o email após o cancelamento p/ o prestador de serviço
     * Chama o método queue que recebe o job e os parâmetros
     */

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
