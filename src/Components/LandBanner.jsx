import React from 'react';
import Image5 from '../Images/14.jpg';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, LineChart, Calendar, Phone } from 'lucide-react';

function LandBanner() {

  const navigate = useNavigate();

  // Function to handle button click
  const handleButtonClick = () => {
    navigate('/landboundary');
  };


  return (
    <div>
     
      <section className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-white">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            </svg>
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 text-left mb-12 md:mb-0">
            <h2 className="text-5xl font-bold mb-6 leading-tight">Transform Your <span className="text-green-300">Land's Potential</span></h2>
            <p className="text-lg text-green-100 mb-8 max-w-xl">
              Our AI-powered analysis provides custom insights to maximize your farm's productivity and sustainability.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={handleButtonClick} className="bg-white text-teal-900 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors flex items-center gap-2">
                <Calendar size={20} />
                Updload Your Land Map
              </button>
              <button className="bg-teal-700 border border-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors flex items-center gap-2">
                <Phone size={20} />
                Contact Sales
              </button>
            </div>
            
            <div className="flex mt-10 gap-8">
              <div className="flex items-center gap-2">
                <MapPin className="text-green-300" />
                <span className="text-sm">Precision Mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="text-green-300" />
                <span className="text-sm">Sustainable Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="text-green-300" />
                <span className="text-sm">Yield Analytics</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/5">
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={Image5}
                  alt="Modern farming landscape with technology" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-teal-900 p-4 rounded-lg shadow-lg w-48">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart size={16} className="text-emerald-600" />
                  <span className="font-bold text-sm">Yield Increase</span>
                </div>
                <div className="text-2xl font-bold">+27%</div>
                <div className="text-xs text-gray-500">Average client results</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandBanner;