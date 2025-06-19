import { 
  FaHome, 
  FaQrcode, 
  FaCamera, 
  FaHistory 
} from 'react-icons/fa';

const FloatingNavDock = () => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-xl p-2 border border-gray-200">
        {/* Home Link */}
        <a 
          href="/" 
          className="p-3 rounded-full hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition-all"
          aria-label="Home"
        >
          <FaHome className="text-xl" />
        </a>
        
        {/* Generator Link */}
        <a 
          href="/QrGenerator" 
          className="p-3 rounded-full hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition-all"
          aria-label="QR Generator"
        >
          <FaQrcode className="text-xl" />
        </a>
        
        {/* Scanner Link */}
        <a 
          href="/QrScanner" 
          className="p-3 rounded-full hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition-all"
          aria-label="QR Scanner"
        >
          <FaCamera className="text-xl" />
        </a>
        
        {/* History Link */}
        <a 
          href="/QrHistory" 
          className="p-3 rounded-full hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition-all"
          aria-label="History"
        >
          <FaHistory className="text-xl" />
        </a>
      </div>
    </div>
  );
};

export default FloatingNavDock;