const prisma = require('../config/database');

async function getStats(req, res, next) {
  try {
    const [pendingListings, reports, activeZones, donations] = await Promise.all([
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.listingReport.count({ where: { status: 'OPEN' } }),
      prisma.listing.count({
        where: {
          type: { in: ['depot', 'urgent'] },
          status: { in: ['APPROVED', 'PENDING'] },
        },
      }),
      prisma.donation.count(),
    ]);

    res.json({
      pendingListings,
      reports,
      activeZones,
      donations,
    });
  } catch (error) {
    next(error);
  }
}

async function getPendingListings(req, res, next) {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (error) {
    next(error);
  }
}

async function getReports(req, res, next) {
  try {
    const reports = await prisma.listingReport.findMany({
      where: { status: 'OPEN' },
      include: {
        listing: {
          select: { id: true, title: true, city: true, district: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
}

async function resolveReport(req, res, next) {
  try {
    const { id } = req.params;

    const report = await prisma.listingReport.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });

    res.json(report);
  } catch (error) {
    next(error);
  }
}

async function getDisasterReports(req, res, next) {
  try {
    const reports = await prisma.disasterReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
}

async function resolveDisasterReport(req, res, next) {
  try {
    const { id } = req.params;
    const report = await prisma.disasterReport.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
    res.json(report);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStats,
  getPendingListings,
  getReports,
  resolveReport,
  getDisasterReports,
  resolveDisasterReport,
};
