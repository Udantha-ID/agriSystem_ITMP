import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, Droplet, CloudRain, Sun, Thermometer, Wifi, AlertCircle, BarChart2, Zap } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import watersmart from "../../Images/SmartFarm/water_smart.png";
import soilmoisture from "../../Images/SmartFarm/soil_moisure.jpg";
import weatherstation from "../../Images/SmartFarm/Agri_Weather.jpg";
import dripirrigation from "../../Images/SmartFarm/Drip_Irrigation.jpg";
import aianalytics from "../../Images/SmartFarm/Dashboard.jpg";
import iotirrigation from "../../Images/SmartFarm/remote.jpg";
import flowsensor from "../../Images/SmartFarm/flow_sensor.jpeg";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function Irrigation() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats for data visualization section
    const stats = [
        { value: '30-50%', label: 'Water savings compared to traditional methods', icon: <Droplet /> },
        { value: '25%', label: 'Increase in crop yields with optimized irrigation', icon: <BarChart2 /> },
        { value: '70%', label: 'Of global freshwater used in agriculture', icon: <CloudRain /> },
        { value: '90%', label: 'Reduction in runoff with smart systems', icon: <Zap /> },
    ];

    // Features data for carousel
    const features = [
        {
            title: "Real-Time Soil Moisture Monitoring",
            description: "Smart irrigation systems utilize advanced soil moisture sensors that are strategically placed throughout agricultural fields or landscaped areas. These sensors continuously measure the water content in the soil and transmit real-time data to a central irrigation controller. This technology ensures plants receive precisely the amount of water they need, when they need it.",
            image: soilmoisture,
            icon: <Droplet className="w-8 h-8" />
        },
        {
            title: "Weather-Adaptive Watering (ET-Based Systems)",
            description: "Modern irrigation systems incorporate evapotranspiration (ET) data from local weather stations and satellite information to make intelligent watering decisions. These systems analyze multiple environmental factors including temperature, humidity, wind speed, and solar radiation to calculate the exact amount of water lost through evaporation and plant transpiration.",
            image: weatherstation,
            icon: <Sun className="w-8 h-8" />
        },
        {
            title: "Automated Drip & Sprinkler Control",
            description: "At the heart of smart irrigation systems are automated control valves that precisely regulate water delivery through either drip irrigation lines or sprinkler systems. These smart valves can be programmed to water specific zones at different rates and frequencies based on plant needs. Drip systems deliver water directly to the root zone through a network of tubes and emitters, minimizing evaporation and runoff.",
            image: dripirrigation,
            icon: <CloudRain className="w-8 h-8" />
        },
        {
            title: "AI & Predictive Analytics",
            description: "The most advanced irrigation systems now incorporate artificial intelligence and machine learning algorithms that analyze vast amounts of historical and real-time data. These systems process information about soil conditions, crop growth stages, weather patterns, and water usage to develop increasingly accurate irrigation models.",
            image: aianalytics,
            icon: <Thermometer className="w-8 h-8" />
        },
        {
            title: "Remote Control & IoT Integration",
            description: "Through Internet of Things (IoT) technology, modern irrigation systems can be monitored and controlled from anywhere using smartphones, tablets, or computers. Cloud-based platforms collect data from all system components and present it through user-friendly dashboards. Farmers receive instant alerts about system status, potential problems, or unusual water usage patterns.",
            image: iotirrigation,
            icon: <Wifi className="w-8 h-8" />
        },
        {
            title: "Water Flow Sensors & Leak Detection",
            description: "Smart irrigation systems incorporate high-precision flow meters that constantly monitor water movement through the entire network. These sensors can detect even small variations in flow rates that might indicate leaks, broken pipes, or clogged emitters. When abnormal water usage is detected, the system immediately alerts the operator and can automatically shut down affected sections to prevent water loss.",
            image: flowsensor,
            icon: <AlertCircle className="w-8 h-8" />
        }
    ];

    // Intersection Observer for scroll animations
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

        // Observe elements
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

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div>
        <div className="w-full bg-gradient-to-br from-blue-50 to-white">
            <Navbar />
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
            <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                >
                    <img
      src={watersmart}
      alt="Smart irrigation system in field"
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
                        Water Conservation Revolution
                    </motion.h1>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-blue-300 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Smart Irrigation Systems
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-100 max-w-3xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Agricultural irrigation accounts for 70% of global freshwater use. Smart systems can reduce water consumption by 30-50% while increasing crop yields by up to 25%.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <a href="#features" className="bg-green-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Features
                        </a>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div
                        className="animate-bounce"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        <a href="#stats" className="text-white">
                            <ChevronDown className="w-12 h-12" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['stats-title'] ? "visible" : "hidden"}
                        id="stats-title"
                    >
                        The Impact of Smart Irrigation
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
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-green-500">
                                    <div className="flex justify-center mb-4 text-green-500">
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

            {/* Features Carousel Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="features-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['features-title'] ? "visible" : "hidden"}
                    >
                        Key Features of Smart Irrigation Systems
                    </motion.h2>

                    <div className="relative">
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex transition-all duration-500 ease-in-out"
                                animate={{ x: `-${activeSlide * 100}%` }}
                                transition={{ type: "tween", ease: "easeInOut" }}
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
                                                    <div className="bg-blue-100 p-3 rounded-full text-green-600">
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
                            <ChevronLeft className="w-6 h-6 text-green-600" />
                        </button>

                        <button
                            onClick={() => setActiveSlide(prev => Math.min(features.length - 1, prev + 1))}
                            disabled={activeSlide === features.length - 1}
                            className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 ${activeSlide === features.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronRight className="w-6 h-6 text-green-600" />
                        </button>

                        {/* Indicators */}
                        <div className="flex justify-center mt-8 gap-2">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${activeSlide === index ? 'bg-green-600 w-6' : 'bg-gray-300'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-green-800 to-green-800">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-white mb-16 observe-me"
                        id="benefits-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['benefits-title'] ? "visible" : "hidden"}
                    >
                        Why Smart Irrigation is a Game-Changer
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <motion.div
                            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-black observe-me"
                            id="benefit-1"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['benefit-1'] ? "visible" : "hidden"}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-400 bg-opacity-20 p-3 rounded-full">
                                    <Droplet className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Water Conservation</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Smart irrigation systems can reduce water usage by 30-50% compared to conventional methods, addressing one of agriculture's most pressing challenges - sustainable water use.
                            </p>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-black observe-me"
                            id="benefit-2"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['benefit-2'] ? "visible" : "hidden"}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-400 bg-opacity-20 p-3 rounded-full">
                                    <BarChart2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Increased Yields</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Farmers see increased crop yields (up to 25%) due to optimized growing conditions, while also benefiting from lower water and energy bills.
                            </p>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-black observe-me"
                            id="benefit-3"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['benefit-3'] ? "visible" : "hidden"}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-400 bg-opacity-20 p-3 rounded-full">
                                    <CloudRain className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Environmental Protection</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Minimizes water waste and reduces the runoff of fertilizers and pesticides into nearby waterways by up to 90%, protecting local ecosystems.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Future Technologies Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="future-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['future-title'] ? "visible" : "hidden"}
                    >
                        Future Trends & Innovations
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Future Tech 1 */}
                        <motion.div
                            className="bg-white rounded-xl shadow-xl overflow-hidden observe-me"
                            id="future-tech-1"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['future-tech-1'] ? "visible" : "hidden"}
                        >
                            <div className="h-48 overflow-hidden bg-blue-100 flex items-center justify-center">
                                <Zap className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Solar-Powered Systems</h3>
                                <p className="text-gray-600">
                                    Solar-powered systems are bringing irrigation capabilities to off-grid areas, particularly in developing countries, making smart irrigation accessible to more farmers worldwide.
                                </p>
                            </div>
                        </motion.div>

                        {/* Future Tech 2 */}
                        <motion.div
                            className="bg-white rounded-xl shadow-xl overflow-hidden observe-me"
                            id="future-tech-2"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['future-tech-2'] ? "visible" : "hidden"}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="h-48 overflow-hidden bg-blue-100 flex items-center justify-center">
                                <Wifi className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">5G & Advanced AI</h3>
                                <p className="text-gray-600">
                                    The integration of 5G networks will enable faster data transmission and real-time decision making. AI will become more sophisticated in predicting water needs and optimizing schedules.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Challenges Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="challenges-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['challenges-title'] ? "visible" : "hidden"}
                    >
                        Current Challenges
                    </motion.h2>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Challenge 1 */}
                                <motion.div
                                    className="bg-blue-50 rounded-xl p-6 observe-me"
                                    id="challenge-1"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['challenge-1'] ? "visible" : "hidden"}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-green-500" />
                                        <span>Initial Investment</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        The upfront cost of smart irrigation systems can be prohibitive for small-scale farmers, despite long-term savings. Financing options and government subsidies are helping to address this barrier.
                                    </p>
                                </motion.div>

                                {/* Challenge 2 */}
                                <motion.div
                                    className="bg-blue-50 rounded-xl p-6 observe-me"
                                    id="challenge-2"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['challenge-2'] ? "visible" : "hidden"}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-green-500" />
                                        <span>Technical Knowledge</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Farmers need training to effectively use and maintain these systems. Extension services and user-friendly interfaces are making the technology more accessible to non-technical users.
                                    </p>
                                </motion.div>

                                {/* Challenge 3 */}
                                <motion.div
                                    className="bg-blue-50 rounded-xl p-6 observe-me"
                                    id="challenge-3"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['challenge-3'] ? "visible" : "hidden"}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-green-500" />
                                        <span>Infrastructure Requirements</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Reliable internet connectivity and power supply are essential for full functionality, which can be lacking in remote agricultural areas. Hybrid systems with offline capabilities are being developed.
                                    </p>
                                </motion.div>

                                {/* Challenge 4 */}
                                <motion.div
                                    className="bg-blue-50 rounded-xl p-6 observe-me"
                                    id="challenge-4"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['challenge-4'] ? "visible" : "hidden"}
                                    transition={{ delay: 0.6 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-green-500" />
                                        <span>Maintenance</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Sensors and automated components require regular calibration and maintenance. Newer systems are being designed with self-diagnostic capabilities and more durable components.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-8 observe-me"
                        id="cta-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-title'] ? "visible" : "hidden"}
                    >
                        Ready to Transform Your Irrigation?
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 observe-me"
                        id="cta-text"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-text'] ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        Smart irrigation technology offers a sustainable solution to water scarcity while improving crop yields and reducing costs. The future of agriculture is precise, efficient, and water-smart.
                    </motion.p>

                    <motion.div
                        className="observe-me"
                        id="cta-buttons"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-buttons'] ? "visible" : "hidden"}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="#contact"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Get a Consultation
                            </a>
                            <a
                                href="#learn-more"
                                className="bg-transparent hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 border-2 border-white hover:border-blue-300"
                            >
                                Download Brochure
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
        <Footer />
        </div>
    );
}

export default Irrigation;