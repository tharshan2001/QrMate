import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminQrHistory = () => {
  const [groupedQrcodes, setGroupedQrcodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedUsers, setExpandedUsers] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchAllQrcodes = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('http://localhost:5001/api/qrcodes/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Group QR codes by userId
        const grouped = data.reduce((acc, qr) => {
          const userId = qr.userId || 'Unknown User';
          if (!acc[userId]) acc[userId] = [];
          acc[userId].push(qr);
          return acc;
        }, {});

        setGroupedQrcodes(grouped);
        
        // Initialize expanded state for all users
        const initialExpandedState = Object.keys(grouped).reduce((acc, userId) => {
          acc[userId] = true;
          return acc;
        }, {});
        setExpandedUsers(initialExpandedState);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch QR codes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllQrcodes();
  }, [token]);

  const deleteQRCode = async (id, userId) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    
    try {
      await axios.delete(`http://localhost:5001/api/qrcodes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroupedQrcodes(prev => {
        const updated = { ...prev };
        updated[userId] = updated[userId].filter(qr => qr._id !== id);
        return updated;
      });

      toast.success('QR Code deleted successfully');
    } catch (error) {
      toast.error('Failed to delete QR Code');
      console.error(error);
    }
  };

  const toggleUserSection = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">QR Code Management</h2>
            <p className="text-gray-600 mt-1">View and manage all generated QR codes</p>
          </div>

          {Object.keys(groupedQrcodes).length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No QR codes found in the system.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedQrcodes).map(([userId, qrcodes]) => (
                <div key={userId} className="p-6 hover:bg-gray-50 transition-colors">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleUserSection(userId)}
                  >
                    <h3 className="text-lg font-semibold">
                      <span className="text-gray-600">User:</span>{' '}
                      <span className="text-blue-600">{userId}</span>
                      <span className="ml-4 text-sm text-gray-500">
                        ({qrcodes.length} QR {qrcodes.length === 1 ? 'code' : 'codes'})
                      </span>
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedUsers[userId] ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {expandedUsers[userId] && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {qrcodes.map((qr) => (
                        <div key={qr._id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition-shadow">
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Title:</span>
                              <p className="font-semibold">{qr.title || 'Untitled QR Code'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Content:</span>
                              <p className="break-words">{qr.content}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Created:</span>
                              <p>{new Date(qr.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {qr.image && (
                            <div className="mt-3 flex flex-col items-center">
                              <img 
                                src={qr.image} 
                                alt="QR code" 
                                className="w-32 h-32 object-contain border p-2 bg-white rounded" 
                              />
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => deleteQRCode(qr._id, userId)}
                              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQrHistory;