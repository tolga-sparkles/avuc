const prisma = require('../config/database');
const { emitToAll } = require('../utils/socket');

async function getListings(req, res, next) {
  try {
    const { city, type, status, verified } = req.query;

    const where = {};
    if (city) where.city = city;
    if (type) where.type = type;
    if (status) where.status = status;
    if (verified !== undefined) where.verified = verified === 'true' || verified === '1';

    // Hide drafts from public listings unless specifically requested
    if (!status) {
      where.status = { not: 'DRAFT' };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, phone: true, score: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (error) {
    next(error);
  }
}

async function createListing(req, res, next) {
  try {
    const {
      type,
      category,
      city,
      district,
      location,
      title,
      description,
      capacity,
      duration,
      amenities,
      lat,
      lng,
      expiresAt,
      status,
    } = req.body;

    const data = {
      type,
      category,
      city,
      district,
      location: location || `${city} / ${district}`,
      title,
      description,
      capacity: capacity ? parseInt(capacity, 10) : null,
      duration: duration || null,
      amenities: amenities || null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      status: status || 'PENDING',
      userId: req.user.id,
    };

    const listing = await prisma.listing.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, phone: true, score: true },
        },
      },
    });

    if (listing.status !== 'DRAFT') {
      emitToAll('new-listing', listing);
    }

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

async function getListingById(req, res, next) {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, phone: true, score: true },
        },
        reports: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ message: 'İlan bulunamadı.' });
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
}

async function updateListingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const listing = await prisma.listing.update({
      where: { id },
      data: { status },
    });

    emitToAll('listing-status-updated', listing);

    res.json(listing);
  } catch (error) {
    next(error);
  }
}

async function reportListing(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const report = await prisma.listingReport.create({
      data: {
        listingId: id,
        reason,
      },
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getListings,
  createListing,
  getListingById,
  updateListingStatus,
  reportListing,
};
