const Notification = require('../schemas/Notification');
const User = require('../models/User');

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      res.status(401).json({
        error: 'Permissão negada para visualizar as notificações deste usuário',
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

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();
