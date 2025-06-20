import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode-generator';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const QrGenerator = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const toastShownRef = useRef(false); 

  useEffect(() => {
    if (!token && !toastShownRef.current) {
      toastShownRef.current = true; 
      toast.error('Please login to generate QR codes');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="grid place-items-center p-4 p-2 mt-50 mb-110">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow">
          <h2 className="mb-2 text-xl font-medium text-red-600">Authentication Required</h2>
          <p className="text-gray-600">Please login to generate QR codes.</p>
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

  useEffect(() => {
    if (!text) return;

    const qr = QRCode(0, 'M');
    qr.addData(text);
    qr.make();

    const cellSize = 8;
    const padding = 20;
    const modules = qr.getModuleCount();
    const qrSize = modules * cellSize;
    const headerHeight = 40;
    const canvasSize = qrSize + padding * 2;
    const canvasHeight = canvasSize + headerHeight;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasSize;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px sans-serif';

    const drawQRCode = () => {
      const offsetY = headerHeight;
      for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(
              padding + col * cellSize,
              offsetY + padding + row * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    };

    const drawTitleWithLogo = () => {
      const logoSize = 30;
      const spacing = 10;
      const titleWidth = ctx.measureText(title).width;
      const totalWidth = logo ? logoSize + spacing + titleWidth : titleWidth;
      const startX = (canvas.width - totalWidth) / 2;

      if (logo) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, startX, 5, logoSize, logoSize);
          ctx.fillText(title, startX + logoSize + spacing, 27);
          drawQRCode();
        };
        img.src = URL.createObjectURL(logo);
      } else {
        ctx.fillText(title, startX, 27);
        drawQRCode();
      }
    };

    drawTitleWithLogo();
  }, [text, title, logo]);

  const downloadPNG = () => {
    if (!text) {
      toast.error('Please enter content first');
      return;
    }

    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'qr-code.png';
    link.click();
    toast.success('QR Code downloaded');
  };

  const saveToServer = async () => {
    if (!token) return;
    if (!text) {
      toast.error('Please enter content first');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Saving QR Code...');

    try {
      await axios.post(
        'https://qr-frontend-production.up.railway.app/api/qrcodes',
        {
          title,
          content: text,
          image: canvasRef.current.toDataURL('image/png'),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('QR Code saved successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save QR Code', { id: toastId });
    } finally {
      setLoading(false);
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
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">QR Generator</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Create QR Code</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Content</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text or URL"
                    className="w-full rounded border p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Optional title"
                    className="w-full rounded border p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">Logo (optional)</label>
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                      onChange={(e) => setLogo(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-800">Preview</h2>
              
              <div className="mb-6 flex min-h-[300px] items-center justify-center rounded bg-gray-50 p-8">
                {text ? (
                  <canvas ref={canvasRef} className="max-h-full max-w-full" />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">Enter content to generate QR code</p>
                  </div>
                )}
              </div>

              {text && (
                <div className="space-y-3">
                  <button
                    onClick={downloadPNG}
                    className="w-full rounded bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={saveToServer}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
                  >
                    {loading ? <Spinner /> : 'Save to Server'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  <>
    <svg className="mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Saving...
  </>
);

export default QrGenerator;
