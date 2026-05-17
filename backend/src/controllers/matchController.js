const prisma = require('../config/database');
const { emitToAll } = require('../utils/socket');

async function getSuggestions(req, res, next) {
  try {
    const { listingId } = req.params;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      return res.status(404).json({ message: 'İlan bulunamadı.' });
    }

    const suggestions = await prisma.listing.findMany({
      where: {
        city: listing.city,
        id: { not: listingId },
        status: { in: ['APPROVED', 'PENDING'] },
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true, score: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
}

async function createMatch(req, res, next) {
  try {
    const { listingId1, listingId2 } = req.body;

    const match = await prisma.match.create({
      data: {
        listingId1,
        listingId2,
        status: 'PENDING',
      },
      include: {
        listing1: true,
        listing2: true,
      },
    });

    emitToAll('new-match', match);

    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
}

async function updateMatchStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const match = await prisma.match.update({
      where: { id },
      data: { status },
      include: {
        listing1: true,
        listing2: true,
      },
    });

    if (status === 'ACCEPTED' || status === 'COMPLETED') {
      await prisma.listing.update({ where: { id: match.listingId1 }, data: { status: 'MATCHED' } });
      await prisma.listing.update({ where: { id: match.listingId2 }, data: { status: 'MATCHED' } });
    }

    emitToAll('match-status-updated', match);

    res.json(match);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSuggestions,
  createMatch,
  updateMatchStatus,
};
