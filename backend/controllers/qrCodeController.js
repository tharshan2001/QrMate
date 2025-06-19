import QrCode from '../backend/models/QrCodeModel.js';

export const createQrCode = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!content || !image) {
      return res.status(400).json({ message: 'Content and image are required.' });
    }

    const newQr = new QrCode({
      userId: req.user._id,
      title,
      content,
      image,
    });

    await newQr.save();
    res.status(201).json({ message: 'QR Code saved successfully!', qr: newQr });
  } catch (err) {
    console.error('Save QR error:', err);
    res.status(500).json({ message: 'Server error while saving QR Code.' });
  }
};

export const getUserQrCodes = async (req, res) => {
  try {
    const qrcodes = await QrCode.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(qrcodes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch QR codes.' });
  }
};


// New method for admin to get all QR codes
export const getAllQrCodes = async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only.' });
    }

    const allQrcodes = await QrCode.find().sort({ createdAt: -1 });
    res.status(200).json(allQrcodes);
  } catch (err) {
    console.error('Failed to fetch all QR codes:', err);
    res.status(500).json({ message: 'Server error fetching all QR codes.' });
  }
};


export const deleteQrCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the QR code by id
    const qr = await QrCode.findById(id);
    if (!qr) {
      return res.status(404).json({ message: 'QR Code not found.' });
    }

    // Check ownership or admin role
    if (req.user._id.toString() !== qr.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this QR Code.' });
    }

    // Correct deletion method
    await qr.deleteOne();

    res.status(200).json({ message: 'QR Code deleted successfully.' });
  } catch (err) {
    console.error('Delete QR error:', err);
    res.status(500).json({ message: 'Server error while deleting QR Code.' });
  }
};
