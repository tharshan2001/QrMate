// src/components/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: "Generate",
      description: "Create custom QR codes for any purpose - URLs, text, contact info, and more.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      title: "Scan",
      description: "Use your device's camera to scan QR codes and instantly access their content.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: "Manage",
      description: "Keep track of all your generated QR codes in one organized place.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section with Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          QR Code Manager
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The ultimate solution for all your QR code needs - generation, scanning, and management made simple.
        </p>
      </motion.section>

      {/* Features Section with Staggered Animation */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="text-blue-600 mb-6 flex justify-center">
              {feature.icon}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">{feature.title}</h2>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Demo Section */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="text-gray-700 text-center">Create your QR code with custom settings</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="text-gray-700 text-center">Scan any QR code with your device camera</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p className="text-gray-700 text-center">Manage all your codes in your personal dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action (without navigation) */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Experience the most comprehensive QR code solution available today.
        </p>
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative px-8 py-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center">
              <span className="text-gray-800 font-medium">Explore the possibilities</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;