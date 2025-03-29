import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Plantation image URLs
const management1 = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const management2 = 'https://images.unsplash.com/photo-1438522014717-d7ce32b9bab9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80';
const management3 = 'https://images.unsplash.com/photo-1582564286939-400a311013a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80';

const Section = ({ children, image, reverse = false }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div 
      ref={ref}
      className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} gap-8 md:gap-12 items-center mb-16 p-8 bg-white/90 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full md:w-1/2 space-y-4">
        {children}
      </div>
      <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-md">
        <motion.img 
          src={image} 
          alt="Plantation management"
          className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const PlantationManagementAbout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-center text-emerald-900 mb-12 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Sustainable Coconut Plantation Management
      </motion.h1>

      <Section image={management1}>
        <h2 className="text-3xl font-semibold text-emerald-800 mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Smart Cultivation
          </span>
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Integrating advanced agricultural practices with real-time data monitoring 
          to optimize coconut cultivation. Our system manages plantation layouts, 
          irrigation cycles, and growth tracking through IoT-enabled sensors.
        </p>
      </Section>

      <Section image={management2} reverse>
        <h2 className="text-3xl font-semibold text-emerald-800 mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Yield Optimization
          </span>
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Machine learning models analyze historical data and environmental factors 
          to predict optimal harvest times. Real-time analytics dashboard provides:
        </p>
      </Section>

      <Section image={management3}>
        <h2 className="text-3xl font-semibold text-emerald-800 mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Eco-Friendly Practices
          </span>
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Sustainable farming techniques combined with renewable energy solutions 
          create an environmentally conscious plantation ecosystem.
        </p>
      </Section>

      <motion.div 
        className="text-center p-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl mt-12 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-3xl font-bold text-emerald-900 mb-6">
          Next-Gen Agricultural Management
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Schedule Demo
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PlantationManagementAbout;