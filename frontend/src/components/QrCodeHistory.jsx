import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const QrCodeHistory = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const toastShownRef = useRef(false);
  const fetchControllerRef = useRef(null);

  // Authentication check effect
  useEffect(() => {
    if (!token && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error('Please login to view QR code history');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [token, navigate]);

  const fetchQrCodes = useCallback(async () => {
    if (!token) return;

    // Cancel any pending requests
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    fetchControllerRef.current = new AbortController();

    setLoading(true);
    const toastId = toast.loading('Loading QR code history...');
    try {
      const { data } = await axios.get('http://localhost:5001/api/qrcodes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: fetchControllerRef.current.signal
      });
      setQrCodes(data);
      toast.success('QR codes loaded successfully', { id: toastId });
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.name === 'CanceledError') return;
      
      console.error('Fetch QR codes error:', err);

      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { id: toastId });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || 'Failed to load QR code history', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchQrCodes();
    }

    return () => {
      // Cleanup: abort pending request when component unmounts
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [token, fetchQrCodes]);

  if (!token) {
    return (
      <div className="grid place-items-center p-4 p-2 mt-50 mb-110">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow">
          <h2 className="mb-2 text-xl font-medium text-red-600">Authentication Required</h2>
          <p className="text-gray-600">Please login to view QR code history.</p>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
              },
            }}
          />
        </div>
      </div>
    );
  }

  const downloadQRCode = (imageData, title = 'qr-code') => {
    try {
      if (!imageData) {
        toast.error('No image data available for download');
        return;
      }
      
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `${title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR Code');
    }
  };

  const deleteQRCode = async (id) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this QR Code?');
    if (!confirmDelete) return;

    const toastId = toast.loading('Deleting QR code...');
    try {
      await axios.delete(`http://localhost:5001/api/qrcodes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrCodes(prev => prev.filter(code => code._id !== id));
      toast.success('QR Code deleted successfully', { id: toastId });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete QR Code', { id: toastId });
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        }}
      />

      <div className="mt-2 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">QR Code History</h1>

          {loading ? (
            <div className="flex justify-center p-6">
              <Spinner />
            </div>
          ) : qrCodes.length === 0 ? (
            <div className="rounded-lg bg-white p-6 shadow text-center mb-50 mt-50">
              <p className="text-gray-600">No QR codes scanned yet.</p>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow mb-60">
              <ul className="space-y-4">
                {qrCodes.map(({ _id, title, content, image, createdAt }) => (
                  <li key={_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt="QR code"
                            className="w-24 h-24 object-contain border rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'placeholder-image-url';
                            }}
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center border rounded bg-gray-100 text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-800">{title || 'Untitled QR Code'}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-600 break-words">{content}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadQRCode(image, title)}
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            disabled={!image}
                          >
                            Download
                          </button>
                          <button
                            onClick={() => deleteQRCode(_id)}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Spinner = () => (
  <>
    <svg className="mr-3 h-5 w-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
  </>
);

export default QrCodeHistory;