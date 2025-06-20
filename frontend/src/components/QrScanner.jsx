import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const QrScanner = () => {
  const [scannedText, setScannedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Check authentication and clean up on unmount
  useEffect(() => {
    if (!token) {
      toast.error('Please login to scan QR codes');
      navigate('/login');
      return;
    }

    return () => {
      stopCamera();
    };
  }, [token, navigate]);

  // Clean up camera resources
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  // Initialize camera and start scanning
  const startCamera = async () => {
    try {
      setLoading(true);
      setCameraError(null);
      stopCamera();

      // Verify browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Ensure video element is mounted
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      // Play video stream
      try {
        await videoRef.current.play();
      } catch (err) {
        throw new Error(`Camera error: ${err.message}`);
      }

      setCameraActive(true);
      setLoading(false);

      // Start QR scanning loop
      const scanFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setScannedText(code.data);
            saveToServer(code.data, canvas.toDataURL());
            stopCamera();
          } else {
            animationFrameRef.current = requestAnimationFrame(scanFrame);
          }
        } else {
          animationFrameRef.current = requestAnimationFrame(scanFrame);
        }
      };

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      console.error('Camera initialization failed:', error);
      setCameraError(error.message);
      toast.error(error.message);
      setLoading(false);
      stopCamera();
    }
  };

  // Handle image upload for QR scanning
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading('Processing image...');
    setScannedText('');

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      if (!canvasRef.current) {
        toast.error('Canvas not available', { id: toastId });
        setLoading(false);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setScannedText(code.data);
        saveToServer(code.data, canvas.toDataURL(), toastId);
      } else {
        toast.error('No QR code found in image', { id: toastId });
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading image file', { id: toastId });
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Save scanned QR data to server
  const saveToServer = async (text, base64Image, toastId) => {
    try {
      await axios.post(
        'https://qrmate-production-e426.up.railway.app/api/qrcodes',
        {
          userId,
          title: isUrl(text) ? 'Scanned URL' : 'Scanned QR Code',
          content: text,
          image: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('QR Code saved successfully!', { id: toastId });
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save QR Code', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Check if text is a URL
  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Render scanned content appropriately
  const renderScannedContent = (text) => {
    if (isUrl(text)) {
      return (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {text}
        </a>
      );
    }
    return <p className="break-all">{text}</p>;
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-md px-4">
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">QR Scanner</h1>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Scan QR Code</h2>

            {cameraError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
                {cameraError}
                <button
                  onClick={startCamera}
                  className="ml-2 text-red-800 font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* Video element always in DOM but conditionally shown */}
              <div className="relative">
                <video
                  ref={videoRef}
                  className={`w-full h-64 object-cover rounded-lg border border-gray-200 ${
                    cameraActive ? 'block' : 'hidden'
                  }`}
                  playsInline
                  muted
                />
                {cameraActive && (
                  <button
                    onClick={stopCamera}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    aria-label="Stop camera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {!cameraActive && (
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    <CameraIcon />
                    {loading ? 'Initializing...' : 'Scan with Camera'}
                  </button>

                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div className="flex items-center justify-center w-full">
                    <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 w-full">
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <UploadIcon />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-medium">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={loading || cameraActive}
                      />
                    </label>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              {loading && (
                <div className="flex justify-center items-center gap-2 text-indigo-600">
                  <Spinner />
                </div>
              )}

              {scannedText && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Scanned Content:</p>
                  <div className="p-3 bg-gray-50 rounded break-words border border-gray-200">
                    {renderScannedContent(scannedText)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Icon components
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg className="mb-4 h-8 w-8 text-gray-500" fill="none" viewBox="0 0 20 16">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    />
  </svg>
);

const Spinner = () => (
  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default QrScanner;