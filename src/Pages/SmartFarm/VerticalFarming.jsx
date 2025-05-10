import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, Leaf, Sun, Thermometer, Wifi, AlertCircle, BarChart2, Zap, Droplet, Factory } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import verticalfarm from "../../Images/SmartFarm/vertical_farm.jpg";
import hydroponics from "../../Images/SmartFarm/hydroponics.jpg";
import ledlights from "../../Images/SmartFarm/led_grow.jpeg";
import automatedsystem from "../../Images/SmartFarm/automated_system.jpg";
import aianalytics from "../../Images/SmartFarm/vertical_farm.jpg";
import urbanfarm from "../../Images/SmartFarm/urban_farm.jpg";
import stackedlayers from "../../Images/SmartFarm/stacked_layers.jpg";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

function VerticalFarming() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats for data visualization section
    const stats = [
        { value: '90%', label: 'Less water usage compared to traditional farming', icon: <Droplet /> },
        { value: '10x', label: 'Higher yields per square meter', icon: <BarChart2 /> },
        { value: '365', label: 'Days of year-round crop production', icon: <Sun /> },
        { value: '70%', label: 'Reduction in transportation emissions for urban areas', icon: <Zap /> },
    ];

    // Features data for carousel
    const features = [
        {
            title: "Hydroponic & Aeroponic Systems",
            description: "Vertical farms utilize soil-less cultivation techniques like hydroponics (growing plants in nutrient-rich water) and aeroponics (growing plants in air with nutrient mist). These systems deliver precise amounts of water and nutrients directly to plant roots, resulting in faster growth rates and higher yields compared to traditional soil-based agriculture.",
            image: hydroponics,
            icon: <Leaf className="w-8 h-8" />
        },
        {
            title: "Precision LED Grow Lights",
            description: "Specially designed LED lighting systems provide the exact light spectrum needed for each crop's optimal growth at different stages. These energy-efficient lights can be tuned to specific wavelengths (like more blue for leafy greens, more red for fruiting plants) and are positioned at ideal distances from plants. Smart systems adjust lighting duration and intensity automatically based on plant needs and growth stages.",
            image: ledlights,
            icon: <Sun className="w-8 h-8" />
        },
        {
            title: "Automated Climate Control",
            description: "Advanced environmental control systems maintain perfect growing conditions 24/7. Temperature, humidity, CO2 levels, and air flow are constantly monitored and adjusted. This creates an ideal microclimate for each crop, eliminating seasonal limitations and protecting plants from extreme weather events that affect traditional farming.",
            image: automatedsystem,
            icon: <Thermometer className="w-8 h-8" />
        },
        {
            title: "AI-Powered Growth Optimization",
            description: "Machine learning algorithms analyze vast amounts of data from sensors monitoring plant health, growth rates, and environmental conditions. The system can predict optimal harvest times, detect early signs of disease or nutrient deficiencies, and automatically adjust growing parameters to maximize yield and quality while minimizing resource use.",
            image: aianalytics,
            icon: <Wifi className="w-8 h-8" />
        },
        {
            title: "Urban Vertical Farming",
            description: "By growing food in multi-story buildings within cities, vertical farms drastically reduce the distance food travels from farm to consumer. This means fresher produce, lower transportation emissions, and food security for urban populations. Abandoned warehouses, shipping containers, and even underground spaces can be transformed into productive farms.",
            image: urbanfarm,
            icon: <Factory className="w-8 h-8" />
        },
        {
            title: "Stacked Growing Systems",
            description: "Vertical farming uses tiered growing systems that multiply production capacity per square foot. Plants are grown in stacked layers, often on rotating shelves or vertical columns to ensure even light distribution. This spatial efficiency allows a vertical farm to produce the same amount of crops as a traditional farm using just 5-10% of the land area.",
            image: stackedlayers,
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
      src={verticalfarm}
      alt="Vertical farm with stacked growing layers"
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
                        The Future of Agriculture
                    </motion.h1>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-green-300 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Vertical Farming Technology
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-100 max-w-3xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Vertical farming can produce 10x more crops per square meter than traditional agriculture while using 90% less water and no pesticides. The global vertical farming market is projected to reach $20 billion by 2028.
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
                        The Impact of Vertical Farming
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
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
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
                        Key Features of Vertical Farming Systems
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
                        Why Vertical Farming is Revolutionary
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
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Space Efficiency</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Vertical farms produce 10-20 times more crops per square meter than traditional farms, making them ideal for urban areas where land is scarce and expensive.
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
                                    <Droplet className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Water Conservation</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                These systems use up to 90% less water than conventional agriculture by recycling water in closed-loop systems and eliminating evaporation and runoff.
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
                                    <Sun className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Year-Round Production</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Controlled environments allow for consistent, year-round crop production regardless of external weather conditions, ensuring stable food supplies.
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
                        Emerging Innovations
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
                                <Zap className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Robotic Harvesting</h3>
                                <p className="text-gray-600">
                                    Advanced robotics and computer vision systems are being developed to automate planting, maintenance, and harvesting in vertical farms, reducing labor costs and increasing efficiency.
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
                                <Wifi className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Optimized Genetics</h3>
                                <p className="text-gray-600">
                                    AI is being used to develop plant varieties specifically optimized for vertical farming conditions - faster growing, more compact, and with higher nutritional value.
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
                                        <span>Energy Consumption</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        The energy requirements for lighting and climate control are significant. While LED efficiency is improving, renewable energy integration is key to making vertical farming truly sustainable.
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
                                        <span>High Initial Costs</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Setting up a vertical farm requires substantial capital investment in infrastructure, technology, and systems. Economies of scale and modular designs are helping to reduce these barriers.
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
                                        <span>Crop Limitations</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Currently, vertical farms are most economically viable for leafy greens, herbs, and some fruits. Research is ongoing to expand viable crop varieties, particularly for staple foods.
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
                                        <span>Technical Expertise</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Operating a vertical farm requires knowledge of horticulture, engineering, and data science. Training programs and simplified control systems are making the technology more accessible.
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
                        Ready to Start Your Vertical Farm?
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 observe-me"
                        id="cta-text"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-text'] ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        Vertical farming represents the next evolution in agriculture - sustainable, efficient, and resilient. Whether you're a commercial grower, urban developer, or community organization, the future of farming is here.
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

export default VerticalFarming;