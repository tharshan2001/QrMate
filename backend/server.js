import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

dotenv.config();
const app = express();

// Middleware: Updated CORS configuration
app.use(cors({
  origin: [
    
    'https://qr-frontend-production.up.railway.app' // your Railway frontend
  ],
  credentials: true,
}));


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/qrcodes', qrRoutes); 

// Root Route
app.get('/', (req, res) => {
  res.send('QR Code Generator & Scanner API');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
