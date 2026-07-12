import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.routes';
import assetRoutes from './routes/asset.routes';
import bookingRoutes from './routes/booking.routes';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ status: 'AssetFlow AI backend is alive' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});