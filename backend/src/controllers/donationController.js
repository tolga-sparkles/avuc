const prisma = require('../config/database');
const { emitToAll } = require('../utils/socket');

async function getDonations(req, res, next) {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(donations);
  } catch (error) {
    next(error);
  }
}

async function createDonation(req, res, next) {
  try {
    const { packageName, items, amount, donorName } = req.body;

    const donation = await prisma.donation.create({
      data: {
        packageName,
        items: items || null,
        amount,
        donorName: donorName || null,
      },
    });

    emitToAll('new-donation', donation);

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
}

async function updateDonationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const donation = await prisma.donation.update({
      where: { id },
      data: { status },
    });

    emitToAll('donation-status-updated', donation);

    res.json(donation);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDonations,
  createDonation,
  updateDonationStatus,
};
