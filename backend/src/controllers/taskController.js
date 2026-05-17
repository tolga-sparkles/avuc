const prisma = require('../config/database');

async function getTasks(req, res, next) {
  try {
    const tasks = await prisma.volunteerTask.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

async function joinTask(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await prisma.volunteerTask.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı.' });
    }

    if (task.joinedCount >= task.people) {
      return res.status(400).json({ message: 'Bu görev için kontenjan dolu.' });
    }

    const existing = await prisma.taskParticipation.findUnique({
      where: { taskId_userId: { taskId: id, userId } },
    });

    if (existing) {
      return res.status(409).json({ message: 'Zaten bu göreve katıldınız.' });
    }

    await prisma.taskParticipation.create({
      data: { taskId: id, userId },
    });

    const updatedTask = await prisma.volunteerTask.update({
      where: { id },
      data: { joinedCount: { increment: 1 } },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  joinTask,
};
