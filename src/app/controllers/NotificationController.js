/**
 * Controller p/ o prestador de serviço listar as notificações de agendamento de seus clientes(usuários)
 */

const Notification = require('../schemas/Notification');
const User = require('../models/User');

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    /**
     * verifica se o usuário logado é um prestador de serviço
     */

    if (!isProvider) {
      res.status(401).json({
        error: 'O usuário não é um prestador de serviço',
      });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const { id } = req.params;

    // const notification = await Notification.findById(id);

    /**
     * mongoose tem a opção de procurar o dado e atualizá-lo passando um objeto
     */

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true }, // campo a ser atualizado
      { new: true } // opção que retorna os dados já atualizados
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();
