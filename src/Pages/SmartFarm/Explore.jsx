import React from 'react';
import { ArrowLeft } from 'lucide-react';
import backgroundImage from '../../Images/SmartFarm/explore.jpg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function Explore() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/smart'); // Navigates to the Smart page
  };

  return (
    <div>
    <div className="min-h-screen relative py-20">
      <Navbar />
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for better readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            {/* Back Button integrated into content */}
            <button
              onClick={handleBack}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
              Introduction to Smart Farming
            </h1>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="animate-fade-in">
                Agriculture has been the backbone of human civilization for thousands of years, providing food, raw materials, and economic stability. However, with the global population expected to reach 9.7 billion by 2050, traditional farming methods are no longer sufficient to meet the increasing demand for food. Climate change, shrinking arable land, water scarcity, and labor shortages further exacerbate the challenges faced by the agricultural sector.
              </p>
              
              <p>
                To address these issues, the world is turning to smart farming—a revolutionary approach that integrates cutting-edge technologies such as the Internet of Things (IoT), Artificial Intelligence (AI), robotics, drones, big data analytics, and automation into agricultural practices. Smart farming, also known as precision agriculture, enables farmers to monitor, analyze, and optimize their operations with unprecedented accuracy and efficiency.
              </p>
              
              <p>
                Unlike conventional farming, which relies heavily on manual labor and generalized practices, smart farming leverages real-time data to make informed decisions. Sensors monitor soil conditions, drones survey crop health, AI predicts weather patterns, and autonomous machinery performs precise planting and harvesting. This data-driven approach minimizes waste, reduces environmental impact, and maximizes productivity, ensuring sustainable food production for future generations.
              </p>
              
              <p>
                The adoption of smart farming is not just a trend but a necessity. Governments, agribusinesses, and small-scale farmers worldwide are investing in these technologies to enhance food security, reduce costs, and mitigate the effects of climate change. From automated greenhouses and vertical farming to livestock tracking systems and blockchain-based supply chains, smart farming is reshaping every aspect of agriculture.
              </p>
              
              <p>
                This detailed exploration of smart farming will cover its key technologies, benefits, challenges, real-world applications, and future trends, providing a comprehensive understanding of how modern agriculture is evolving in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Explore;