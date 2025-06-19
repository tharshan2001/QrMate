import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-600 py-6 text-white mt-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">

          {/* Copyright */}
          <div className="text-center mt-4">
            <p className="text-indigo-100">
              © {currentYear} <span className="font-semibold text-white">QRMate</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;