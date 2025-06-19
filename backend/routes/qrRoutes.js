import express from 'express';
import {
  createQrCode,
  getUserQrCodes,
  getAllQrCodes,
  deleteQrCode
} from '../controllers/qrCodeController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/qrcodes - create QR code (authenticated users)
router.post('/', protect, createQrCode);

// GET /api/qrcodes - get QR codes for current user
router.get('/', protect, getUserQrCodes);

// GET /api/qrcodes/all - admin-only route to get all QR codes
router.get('/all', protect, authorize('admin'), getAllQrCodes);

// DELETE /api/qrcodes/:id - delete QR code if owner or admin
router.delete('/:id', protect, deleteQrCode);

export default router;
