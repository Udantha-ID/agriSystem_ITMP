import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Navigation, Smartphone, Battery, Clock, Shield, Globe, ChevronDown, AlertCircle, BarChart2, Zap, Map } from 'lucide-react';
import gpsTracking from "../../Images/SmartFarm/gps_tracking.jpg";
import realTimeTracking from "../../Images/SmartFarm/real_time_tracking.jpg";
import geofencing from "../../Images/SmartFarm/geofencing.jpg";
import mobileApp from "../../Images/SmartFarm/mobile_app.jpg";
import analyticsData from "../../Images/SmartFarm/analytics_data.jpg";
import assetTracking from "../../Images/SmartFarm/asset_tracking.jpg";
import batteryLife from "../../Images/SmartFarm/battery_life.jpg";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function GPSTracking() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats for data visualization section
    const stats = [
        { value: '30%', label: 'Reduction in fuel consumption', icon: <Zap /> },
        { value: '45%', label: 'Increase in workforce productivity', icon: <BarChart2 /> },
        { value: '60%', label: 'Decrease in unauthorized equipment use', icon: <Shield /> },
        { value: '25%', label: 'Lower maintenance costs', icon: <Clock /> },
    ];

    // Features data for carousel
    const features = [
        {
            title: "Real-Time GPS Tracking",
            description: "Our advanced GPS tracking system provides real-time location data for all your agricultural equipment and vehicles. Monitor the exact position, speed, and direction of your assets with precise accuracy down to 2-3 meters. The system updates every 10 seconds to ensure you always have the most current information on your fleet's whereabouts.",
            image: realTimeTracking,
            icon: <MapPin className="w-8 h-8" />
        },
        {
            title: "Geofencing & Boundary Alerts",
            description: "Create virtual boundaries around your fields, storage areas, or any designated zones. Receive instant notifications when equipment enters or exits these predetermined areas. This feature helps prevent theft, unauthorized use, and ensures your equipment stays where it belongs. Configure multiple geofences with custom alert settings for different assets.",
            image: geofencing,
            icon: <Navigation className="w-8 h-8" />
        },
        {
            title: "Mobile App Access",
            description: "Access your entire GPS tracking system from anywhere using our intuitive mobile application. Available for both iOS and Android devices, the app provides comprehensive control and monitoring capabilities while on the go. View real-time positions, receive alerts, generate reports, and manage your farm's assets from the convenience of your smartphone.",
            image: mobileApp,
            icon: <Smartphone className="w-8 h-8" />
        },
        {
            title: "Analytics & Reporting",
            description: "Transform raw tracking data into actionable insights with our powerful analytics tools. Generate detailed reports on equipment usage patterns, idle time, travel distances, and operational efficiency. Customize reporting parameters to focus on the metrics that matter most to your operation and schedule automated report delivery.",
            image: analyticsData,
            icon: <BarChart2 className="w-8 h-8" />
        },
        {
            title: "Asset Management System",
            description: "Beyond simple location tracking, our comprehensive asset management system keeps detailed records of all your equipment. Track maintenance schedules, usage hours, service history, and operator assignments. Receive automated alerts for upcoming maintenance based on either calendar time or actual operating hours.",
            image: assetTracking,
            icon: <Globe className="w-8 h-8" />
        },
        {
            title: "Extended Battery Life Technology",
            description: "Our GPS tracking devices feature advanced power management systems that extend battery life up to 6 months on a single charge when in standard mode. For less frequently used equipment, the sleep mode can extend battery life to over a year. Solar-powered options are available for continuous operation without the need for recharging.",
            image: batteryLife,
            icon: <Battery className="w-8 h-8" />
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
            <div className="w-full bg-gradient-to-br from-green-50 to-white">
                <Navbar />
                {/* Hero Section */}
                <section className="relative h-screen overflow-hidden bg-gradient-to-br from-green-600 to-green-800">
                    <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <img
                            src={gpsTracking}
                            alt="GPS tracking system for agriculture"
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
                            Precision Agriculture Tracking
                        </motion.h1>
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold text-green-300 mb-8"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            Advanced GPS Tracking Systems
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-100 max-w-3xl mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            Modern farms lose up to 15% of valuable equipment and time due to inefficient tracking. Our GPS solutions increase operational efficiency by 45% while reducing fuel costs by 30%.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <a href="#features" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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
                            The Impact of GPS Tracking in Agriculture
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
                            Key Features of Agricultural GPS Tracking
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
                                                        <div className="bg-green-100 p-3 rounded-full text-green-600">
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
                            Why GPS Tracking is Essential for Modern Farming
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
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Operational Efficiency</h3>
                                </div>
                                <p className="text-black text-opacity-90">
                                    GPS tracking optimizes routes and reduces unnecessary travel time, leading to 30% less fuel consumption and a significant decrease in equipment wear and tear.
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
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Enhanced Security</h3>
                                </div>
                                <p className="text-black text-opacity-90">
                                    Equipment theft costs farmers billions annually. GPS systems with geofencing capabilities reduce unauthorized use by 60% and improve recovery rates of stolen equipment to over 90%.
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
                                        <BarChart2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                                </div>
                                <p className="text-black text-opacity-90">
                                    Tracking systems generate comprehensive usage analytics that help optimize field operations, maintenance schedules, and resource allocation, boosting overall farm productivity by up to 45%.
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
                                <div className="h-48 overflow-hidden bg-green-100 flex items-center justify-center">
                                    <Globe className="w-20 h-20 text-green-400" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Centimeter-Level Precision</h3>
                                    <p className="text-gray-600">
                                        Next-generation GPS systems will achieve sub-centimeter accuracy using advanced RTK (Real-Time Kinematic) technology, enabling ultra-precise operations like automated seeding and micro-targeted chemical application.
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
                                <div className="h-48 overflow-hidden bg-green-100 flex items-center justify-center">
                                    <Map className="w-20 h-20 text-green-400" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Predictive Tracking</h3>
                                    <p className="text-gray-600">
                                        Machine learning algorithms will analyze historical tracking data to predict optimal equipment routing, usage patterns, and maintenance needs before issues arise, revolutionizing preventative maintenance in agriculture.
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
                                        className="bg-green-50 rounded-xl p-6 observe-me"
                                        id="challenge-1"
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate={isVisible['challenge-1'] ? "visible" : "hidden"}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircle className="text-green-500" />
                                            <span>Rural Connectivity</span>
                                        </h3>
                                        <p className="text-gray-600">
                                            Reliable internet connectivity remains a challenge in many rural farming regions, affecting real-time data transmission. New systems are incorporating offline capabilities with periodic synchronization to address this limitation.
                                        </p>
                                    </motion.div>

                                    {/* Challenge 2 */}
                                    <motion.div
                                        className="bg-green-50 rounded-xl p-6 observe-me"
                                        id="challenge-2"
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate={isVisible['challenge-2'] ? "visible" : "hidden"}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircle className="text-green-500" />
                                            <span>Battery Longevity</span>
                                        </h3>
                                        <p className="text-gray-600">
                                            Power requirements for continuous GPS tracking can drain battery life, especially on equipment used seasonally. Emerging energy harvesting technologies and ultra-low-power GPS modules are being developed to extend device operation.
                                        </p>
                                    </motion.div>

                                    {/* Challenge 3 */}
                                    <motion.div
                                        className="bg-green-50 rounded-xl p-6 observe-me"
                                        id="challenge-3"
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate={isVisible['challenge-3'] ? "visible" : "hidden"}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircle className="text-green-500" />
                                            <span>Systеm Integration</span>
                                        </h3>
                                        <p className="text-gray-600">
                                            Farmers often use equipment from different manufacturers with proprietary systems. Industry efforts are underway to create universal standards that allow seamless integration between various tracking platforms and farm management software.
                                        </p>
                                    </motion.div>

                                    {/* Challenge 4 */}
                                    <motion.div
                                        className="bg-green-50 rounded-xl p-6 observe-me"
                                        id="challenge-4"
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate={isVisible['challenge-4'] ? "visible" : "hidden"}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <AlertCircle className="text-green-500" />
                                            <span>Data Security</span>
                                        </h3>
                                        <p className="text-gray-600">
                                            With the increasing digitization of farm operations, protecting sensitive tracking and operational data from cyber threats has become critical. Advanced encryption and blockchain-based security measures are being implemented to safeguard farm data.
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
                            Ready to Transform Your Farm Operations?
                        </motion.h2>

                        <motion.p
                            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 observe-me"
                            id="cta-text"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['cta-text'] ? "visible" : "hidden"}
                            transition={{ delay: 0.2 }}
                        >
                            GPS tracking technology offers a comprehensive solution for modern agricultural operations, enhancing efficiency, security, and profitability. Join the precision agriculture revolution today.
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
                                    Request a Demo
                                </a>
                                <a
                                    href="#learn-more"
                                    className="bg-transparent hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 border-2 border-white hover:border-green-300"
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

export default GPSTracking;