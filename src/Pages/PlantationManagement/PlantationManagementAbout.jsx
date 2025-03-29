import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, BarChart2, Droplet, Zap, Search, Layers, Clock, Leaf, Sun, CloudRain, Globe } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Plantation images
const management1 = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const management2 = 'https://images.unsplash.com/photo-1438522014717-d7ce32b9bab9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80';
const management4 = 'https://images.unsplash.com/photo-1582564286939-400a311013a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80';
const management3 = 'https://images.unsplash.com/photo-1582564286939-400a311013a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80';

const PlantationManagementAbout = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats data
    const stats = [
        { value: '50M+', label: 'Coconut Trees Managed', icon: <Leaf className="w-8 h-8" /> },
        { value: '40%', label: 'Yield Increase', icon: <BarChart2 className="w-8 h-8" /> },
        { value: '70%', label: 'Water Savings', icon: <Droplet className="w-8 h-8" /> },
        { value: '24/7', label: 'Growth Monitoring', icon: <Clock className="w-8 h-8" /> },
    ];

    // Management features carousel
    const features = [
        {
            title: "Smart Cultivation System",
            description: "IoT-enabled sensors and satellite imaging provide real-time monitoring of soil health, moisture levels, and tree vitality. Our AI algorithms optimize planting patterns for maximum yield.",
            image: management1,
            icon: <Zap className="w-8 h-8" />
        },
        {
            title: "Precision Irrigation",
            description: "Smart water management system that analyzes weather patterns and soil conditions to deliver exact hydration needs. Reduces water usage by up to 70% while improving crop health.",
            image: management2,
            icon: <CloudRain className="w-8 h-8" />
        },
        {
            title: "Sustainable Practices",
            description: "Integrated organic farming techniques combined with renewable energy solutions. Carbon-negative operations with complete traceability from sapling to harvest.",
            image: management3,
            icon: <Globe className="w-8 h-8" />
        }
    ];

    // Timeline data
    const timelineData = [
        {
            year: "Year-Round",
            title: "Continuous Growth Monitoring",
            content: "Multi-spectral imaging tracks tree health metrics 24/7, detecting nutrient deficiencies early"
        },
        {
            year: "Every 6 Months",
            title: "Soil Optimization Cycle",
            content: "Complete soil analysis and nutrient balancing using organic amendments"
        },
        {
            year: "Annual",
            title: "Yield Maximization",
            content: "Pruning strategy optimization and pollination enhancement programs"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll('.observe-me').forEach(el => {
            observer.observe(el);
            observedElements.current[el.id] = el;
        });

        return () => {
            Object.values(observedElements.current).forEach(el => {
                observer.unobserve(el);
            });
        };
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="w-full bg-gradient-to-br from-emerald-50 to-white">
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                >
                    <img
                        src={management1}
                        alt="Coconut plantation"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Next-Gen Crop Management
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-100 max-w-3xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Revolutionizing coconut farming through AI-driven analytics, sustainable practices, and precision agriculture technologies.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <a href="#features" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Innovations
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['stats-title'] ? "visible" : "hidden"}
                        id="stats-title"
                    >
                        Transforming Crop Management
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="observe-me"
                                id={`stat-${index}`}
                                variants={fadeInUp}
                                initial="hidden"
                                animate={isVisible[`stat-${index}`] ? "visible" : "hidden"}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-emerald-500">
                                    <div className="flex justify-center mb-4 text-emerald-500">
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                                    <p className="text-gray-600">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Carousel */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="features-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['features-title'] ? "visible" : "hidden"}
                    >
                        Advanced Management Features
                    </motion.h2>

                    <div className="relative">
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex transition-all duration-500 ease-in-out"
                                animate={{ x: `-${activeSlide * 100}%` }}
                            >
                                {features.map((feature, index) => (
                                    <div key={index} className="min-w-full">
                                        <div className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                                            <div className="lg:w-1/2 h-72 lg:h-96 overflow-hidden">
                                                <img
                                                    src={feature.image}
                                                    alt={feature.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                />
                                            </div>
                                            <div className="lg:w-1/2 p-8">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                                        {feature.icon}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Carousel Controls */}
                        <button
                            onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                            disabled={activeSlide === 0}
                            className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 ${activeSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronLeft className="w-6 h-6 text-emerald-600" />
                        </button>

                        <button
                            onClick={() => setActiveSlide(prev => Math.min(features.length - 1, prev + 1))}
                            disabled={activeSlide === features.length - 1}
                            className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 ${activeSlide === features.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronRight className="w-6 h-6 text-emerald-600" />
                        </button>

                        {/* Indicators */}
                        <div className="flex justify-center mt-8 gap-2">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${activeSlide === index ? 'bg-emerald-600 w-6' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Management Timeline */}
            <section className="py-20 px-4 bg-emerald-50">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="timeline-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['timeline-title'] ? "visible" : "hidden"}
                    >
                        Annual Management Cycle
                    </motion.h2>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200"></div>
                        <div className="space-y-16 relative">
                            {timelineData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={`flex flex-col md:flex-row items-center observe-me ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                    id={`timeline-${index}`}
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible[`timeline-${index}`] ? "visible" : "hidden"}
                                >
                                    <div className="md:w-1/2 p-6">
                                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">{item.year}</h3>
                                        <h4 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h4>
                                        <p className="text-gray-600">{item.content}</p>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white"></div>
                                    <div className="md:w-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-emerald-700 to-green-800 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-8 observe-me"
                        id="cta-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-title'] ? "visible" : "hidden"}
                    >
                        Ready to Revolutionize Your Plantation?
                    </motion.h2>
                    
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-buttons'] ? "visible" : "hidden"}
                    >
                        <a
                            href="#contact"
                            className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Schedule Consultation
                        </a>
                        <a
                            href="#learn-more"
                            className="border-2 border-white hover:border-emerald-200 text-white font-bold py-4 px-8 rounded-full transition-all duration-300"
                        >
                            Download Brochure
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PlantationManagementAbout;