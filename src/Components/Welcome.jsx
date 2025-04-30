import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, Sprout, Cloud, Store, Calendar, 
  Droplets, BarChart3, Tractor 
} from "lucide-react";
import { Link } from "react-router-dom"; 

import image1 from "../Images/12.jpeg";
import image2 from "../Images/11.jpg";
import image3 from "../Images/10.jpg";
import image4 from "../Images/13.jpg";

const images = [image1, image2, image3, image4];

// Features List
const features = [
  { 
    title: "Smart Farming",
    description: "Technology enhances agriculture for efficiency, automation, and sustainability.", 
    icon: <Sprout className="w-8 h-8 text-emerald-600" />, 
    bgGradient: "bg-gradient-to-br from-emerald-50 to-green-100", 
    accentColor: "emerald",
    secondaryIcon: <Droplets className="w-5 h-5 text-emerald-500"/>,
    path: "/smart"
  },
  { 
    title: "Climate Intelligence", 
    description: "Hyperlocal weather forecasts and climate adaptation strategies.", 
    icon: <Cloud className="w-8 h-8 text-sky-600" />, 
    bgGradient: "bg-gradient-to-br from-sky-50 to-blue-100",
    accentColor: "sky",
    secondaryIcon: <BarChart3 className="w-5 h-5 text-sky-500" />,
    path: "/climate-intelligence" 
  },
  { 
    title: "Marketplace Connect", 
    description: "Direct-to-consumer platform with transparent pricing.", 
    icon: <Store className="w-8 h-8 text-amber-600" />, 
    bgGradient: "bg-gradient-to-br from-amber-50 to-yellow-100",
    accentColor: "amber",
    secondaryIcon: <Tractor className="w-5 h-5 text-amber-500" />,
    path: "/marketplace-connect"
  },
  { 
    title: "Crop Management", 
    description: "End-to-end planning tools for optimal crop cycles.", 
    icon: <Calendar className="w-8 h-8 text-violet-600" />, 
    bgGradient: "bg-gradient-to-br from-violet-50 to-purple-100",
    accentColor: "violet",
    secondaryIcon: <Calendar className="w-5 h-5 text-violet-500" />,
    path: "/plantabout"
  }
];

const Welcome = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleExploreClick = () => {
    document.getElementById("smart-solutions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* 🌱 Hero Section */}
      <div className="relative mt-0 h-[600px] overflow-hidden">
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt="Welcome to AgroMarket"
            className="absolute w-full h-full object-cover brightness-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImage ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-xl">
            The Future of Farming Starts Here
          </h1>
          <p className="text-lg max-w-2xl">
            Unlock the power of technology to boost productivity and efficiency.
          </p>
          <button onClick={handleExploreClick} className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg">
            Explore Now
          </button>
        </div>
      </div>

      {/* 🌍 Smart Solutions Section */}
      <section id="smart-solutions" className="max-w-7xl mx-auto px-6 py-20 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-300 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        {/* Section Header */}
        <div className="text-center relative z-10 mb-16">
         
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Solutions for Modern Agriculture
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Our suite of digital tools empowers farmers to make data-driven decisions, 
            increase efficiency, and adopt sustainable practices.
          </p>
        </div>

        {/* 🚀 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-2xl p-8 shadow-md border border-gray-100 ${feature.bgGradient} relative overflow-hidden`}
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-white opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 rounded-full bg-white opacity-20"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-4">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 mb-6 relative z-10">{feature.description}</p>
              
              {/* Feature Tag */}
              <div className="flex items-center gap-2 mb-4">
                {feature.secondaryIcon}
                <span className={`text-xs font-medium text-${feature.accentColor}-600`}>
                  Enhanced Solutions
                </span>
              </div>
              
              <Link 
                to={feature.path} 
                className={`mt-2 text-${feature.accentColor}-600 font-medium flex items-center gap-2 hover:gap-3 transition-all`}
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Welcome;
