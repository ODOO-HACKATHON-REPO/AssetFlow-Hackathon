import { Request, Response, Router } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const router = Router();

// CREATE booking (any logged-in user)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { assetId, startTime, endTime, purpose } = req.body;
    const userId = req.user!.userId;

    if (!assetId || !startTime || !endTime) {
      return res.status(400).json({ error: 'assetId, startTime, and endTime are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: 'Invalid time range' });
    }

    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check for overlapping CONFIRMED bookings on the same asset
    const conflict = await prisma.booking.findFirst({
      where: {
        assetId,
        status: 'CONFIRMED',
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      return res.status(400).json({ error: 'Asset is already booked for this time range' });
    }

    const booking = await prisma.booking.create({
      data: { assetId, userId, startTime: start, endTime: end, purpose },
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: 'ALLOCATED' },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// LIST bookings (own for EMPLOYEE, all for ADMIN/MANAGER)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;

    const bookings = await prisma.booking.findMany({
      where: role === 'EMPLOYEE' ? { userId } : {},
      orderBy: { startTime: 'desc' },
      include: { asset: true },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET single booking
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { asset: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { userId, role } = req.user!;
    if (role === 'EMPLOYEE' && booking.userId !== userId) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// UPDATE booking status (owner can cancel, ADMIN/MANAGER can set any status)
router.put('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { userId, role } = req.user!;
    const isOwner = booking.userId === userId;
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';

    if (!isPrivileged && !(isOwner && status === 'CANCELLED')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Free up the asset if booking ends/cancels
    if (status === 'CANCELLED' || status === 'COMPLETED') {
      await prisma.asset.update({
        where: { id: booking.assetId },
        data: { status: 'AVAILABLE' },
      });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;