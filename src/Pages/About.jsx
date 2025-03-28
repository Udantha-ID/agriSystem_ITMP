import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Globe, Users, Target, Leaf, Award, BookOpen, 
  CloudRain, Droplets, Store, Tractor, 
  ArrowRight, Zap, PieChart 
} from 'lucide-react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const About = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [activeTab, setActiveTab] = useState('mission');
  const projectRef = useRef(null);
  const isProjectInView = useInView(projectRef, { once: true });

  const missionValues = [
    {
      icon: <Globe className="w-12 h-12 text-green-700" />, 
      title: "Global Agricultural Innovation",
      description: "Pioneering sustainable farming solutions that transcend geographical boundaries and technological limitations.",
      gradient: "bg-gradient-to-br from-green-100 to-emerald-200 shadow-lg"
    },
    {
      icon: <Users className="w-12 h-12 text-blue-700" />, 
      title: "Collaborative Ecosystem",
      description: "Building interconnected networks of farmers, technologists, and researchers to drive transformative agricultural change.",
      gradient: "bg-gradient-to-br from-blue-100 to-indigo-200 shadow-lg"
    },
    {
      icon: <Target className="w-12 h-12 text-yellow-700" />, 
      title: "Precision Agriculture 4.0",
      description: "Integrating advanced AI, IoT, and machine learning to create intelligent, data-driven farming ecosystems.",
      gradient: "bg-gradient-to-br from-yellow-100 to-orange-200 shadow-lg"
    }
  ];

  const projects = [
    {
      title: "Smart Irrigation Revolution",
      description: "Advanced AI-powered water management system utilizing machine learning and IoT sensors for precision agriculture.",
      icon: <Droplets className="w-14 h-14 text-blue-600" />,
      location: "Anuradhapura, Sri Lanka",
      impact: ["40% Water Conservation", "Predictive Resource Allocation", "Real-time Monitoring"],
      technologies: ["Machine Learning", "IoT Sensors", "Predictive Analytics"]
    },
    {
      title: "Solar Farming Ecosystem",
      description: "Comprehensive renewable energy integration with intelligent greenhouse management and sustainable crop production.",
      icon: <Store className="w-14 h-14 text-yellow-600" />,
      location: "Jaffna, Sri Lanka",
      impact: ["Carbon Neutral Operations", "Year-round Crop Production", "Energy Efficiency"],
      technologies: ["Solar Technology", "Climate Control Systems", "Vertical Farming"]
    },
    {
      title: "Climate Adaptive Farming",
      description: "Cutting-edge weather prediction and crop recommendation platform leveraging satellite imagery and AI algorithms.",
      icon: <CloudRain className="w-14 h-14 text-sky-600" />,
      location: "Kandy, Sri Lanka",
      impact: ["Risk Mitigation", "Optimized Crop Selection", "Sustainable Yield Improvement"],
      technologies: ["Satellite Imaging", "Predictive Modeling", "Climate Analytics"]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />

      {/* Hero Section with Parallax-like Effect */}
      <motion.section 
        className="relative bg-green-50 py-40 px-6 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-200 opacity-10 animate-pulse"></div>
        <motion.h1
          className="text-7xl font-extrabold text-green-900 drop-shadow-lg relative z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          Reimagining Agriculture
        </motion.h1>
        <p className="text-2xl text-gray-800 mt-6 max-w-4xl mx-auto relative z-10">
          Transforming agricultural landscapes through intelligent technology, sustainable practices, and innovative ecosystem design.
        </p>
      </motion.section>

      {/* Interactive Tabs Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-center space-x-6 mb-12">
          {['mission', 'approach', 'impact'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-green-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'mission' && (
            <motion.div 
              key="mission"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {missionValues.map((item, index) => (
                <motion.div
                  key={index}
                  className={`rounded-3xl p-8 ${item.gradient} relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-md mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-800 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
          {activeTab === 'approach' && (
            <motion.div
              key="approach"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center"
            >
              <div className="flex justify-center space-x-8 mb-8">
                <Zap className="w-16 h-16 text-yellow-500" />
                <PieChart className="w-16 h-16 text-blue-500" />
                <Globe className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tech-Driven Agricultural Transformation
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                Our holistic approach integrates cutting-edge technologies, data-driven insights, and sustainable practices to revolutionize agricultural ecosystems.
              </p>
            </motion.div>
          )}
          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Quantitative Impact
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <ArrowRight className="w-6 h-6 mr-3 text-green-600" />
                    40% Reduction in Water Consumption
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-6 h-6 mr-3 text-green-600" />
                    30% Increase in Crop Yield
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-6 h-6 mr-3 text-green-600" />
                    60% Improved Resource Efficiency
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-8 shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Sustainable Development Goals
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  Aligned with global sustainability objectives, our initiatives contribute directly to zero hunger, climate action, and responsible consumption.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Project Showcase */}
      <section ref={projectRef} className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
          Innovative Agricultural Projects
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className={`mb-6 p-6 rounded-2xl cursor-pointer transition-all group ${
                  activeProject === index 
                    ? 'bg-green-50 border-2 border-green-300' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-green-100/50'
                }`}
                onClick={() => setActiveProject(index)}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center mb-4">
                  {project.icon}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-800 transition">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Tractor className="w-4 h-4 mr-2" /> {project.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{project.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Project Detailed View */}
          <motion.div
            className="bg-white rounded-3xl p-10 shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isProjectInView ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {projects[activeProject].title}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Key Impact</h4>
                <ul className="space-y-2 text-gray-700">
                  {projects[activeProject].impact.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {projects[activeProject].technologies.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;