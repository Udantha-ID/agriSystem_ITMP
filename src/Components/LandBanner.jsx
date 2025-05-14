import React from 'react';
import Image5 from '../Images/14.jpg';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, LineChart, Calendar, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

function LandBanner() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/landboundary');
  };

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white py-24 relative overflow-hidden">
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
        
        {/* Text Section */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          className="md:w-1/2 mb-12 md:mb-0"
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Transform Your <span className="text-green-300">Land's Potential</span>
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-xl">
            Our AI-powered analysis provides custom insights to maximize your farm's productivity and sustainability.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleButtonClick}
              className="bg-white text-teal-900 px-6 py-3 rounded-xl font-semibold hover:bg-green-100 transition flex items-center gap-2 shadow-md"
            >
              <Calendar size={20} />
              Upload Your Land Map
            </button>
            <button
              className="bg-transparent border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-teal-800 transition flex items-center gap-2"
            >
              <Phone size={20} />
              Contact Sales
            </button>
          </div>

          <div className="flex mt-10 gap-8 flex-wrap">
            {[{ Icon: MapPin, text: 'Precision Mapping' }, { Icon: Leaf, text: 'Sustainable Solutions' }, { Icon: LineChart, text: 'Yield Analytics' }].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="text-green-300" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image & Floating Card */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          className="md:w-2/5 relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={Image5}
              alt="Modern farming with AI"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Stats Card with Glass Effect */}
          <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-lg text-teal-900 p-4 rounded-xl shadow-xl w-48">
            <div className="flex items-center gap-2 mb-1">
              <LineChart size={16} className="text-emerald-600" />
              <span className="font-bold text-sm">Yield Increase</span>
            </div>
            <div className="text-2xl font-bold">+27%</div>
            <div className="text-xs text-gray-600">Avg. client results</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LandBanner;
