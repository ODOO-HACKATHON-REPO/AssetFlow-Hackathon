import { Request, Response, Router } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const router = Router();

// GET all assets
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// GET single asset
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// CREATE asset (ADMIN, MANAGER only)
router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN', 'MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const { name, category, location, qrCode, status } = req.body;

      if (!name || !category) {
        return res.status(400).json({ error: 'name and category are required' });
      }

      const asset = await prisma.asset.create({
        data: { name, category, location, qrCode, status },
      });

      res.status(201).json(asset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create asset' });
    }
  }
);

// UPDATE asset (ADMIN, MANAGER only)
router.put(
  '/:id',
  authMiddleware,
  requireRole('ADMIN', 'MANAGER'),
  async (req: Request, res: Response) => {
    try {
      const { name, category, location, qrCode, status } = req.body;

      const asset = await prisma.asset.update({
        where: { id: req.params.id },
        data: { name, category, location, qrCode, status },
      });

      res.json(asset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update asset' });
    }
  }
);

// DELETE asset (ADMIN only)
router.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await prisma.asset.delete({
        where: { id: req.params.id },
      });
      res.json({ message: 'Asset deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete asset' });
    }
  }
);

export default router;