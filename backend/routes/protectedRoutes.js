import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin-data', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin-only data' });
});

router.get('/user-data', protect, authorize('user', 'admin'), (req, res) => {
  res.json({ message: 'User or Admin data' });
});

export default router;
