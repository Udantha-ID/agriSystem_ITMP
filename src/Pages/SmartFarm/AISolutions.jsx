import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Brain, Database, Cloud, Server, LineChart, Code, ChevronDown, AlertCircle, Cpu, BarChart2, Zap } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// Import image paths - these should match your project structure
import aiHero from "../../Images/SmartFarm/ai_hero.png";
import computerVision from "../../Images/SmartFarm/computer_vision.jpg";
import machineLearning from "../../Images/SmartFarm/machine_learning.jpg";
import predictiveAnalytics from "../../Images/SmartFarm/predictive_analytics.jpg";
import aiRobotics from "../../Images/SmartFarm/ai_robotics.jpg";
import nlpSystems from "../../Images/SmartFarm/nlp_systems.jpg";
import cloudComputing from "../../Images/SmartFarm/cloud_computing.jpg";

function AiSolutions() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats for data visualization section
    const stats = [
        { value: '35%', label: 'Increased crop yield with AI-powered farming', icon: <BarChart2 /> },
        { value: '40%', label: 'Reduction in resource wastage with predictive analytics', icon: <Database /> },
        { value: '60%', label: 'Time saved in decision-making processes', icon: <Brain /> },
        { value: '85%', label: 'Accuracy in pest and disease identification', icon: <Zap /> },
    ];

    // Features data for carousel
    const features = [
        {
            title: "Computer Vision for Plant Monitoring",
            description: "Advanced computer vision algorithms analyze images from drones, satellites, and ground cameras to detect plant health issues, nutrient deficiencies, and pest infestations at their earliest stages. These systems can scan thousands of plants per hour with accuracy rates exceeding human capabilities, identifying problems days or even weeks before they would be visible to the naked eye.",
            image: computerVision,
            icon: <Brain className="w-8 h-8" />
        },
        {
            title: "Machine Learning Crop Optimization",
            description: "Machine learning models analyze vast datasets covering weather patterns, soil conditions, crop genetics, and historical yields to develop optimized growing recommendations. These systems continuously learn from each growing season, adapting their recommendations to improve outcomes for specific farm locations, crop varieties, and changing climate conditions.",
            image: machineLearning,
            icon: <Database className="w-8 h-8" />
        },
        {
            title: "Predictive Analytics for Resource Management",
            description: "AI-powered predictive analytics forecast future conditions to optimize resource allocation across the farm. These systems predict water needs, disease outbreaks, optimal harvest times, and market demands with remarkable accuracy. Farmers can proactively allocate resources rather than reacting to problems after they emerge, reducing waste and improving profitability.",
            image: predictiveAnalytics,
            icon: <LineChart className="w-8 h-8" />
        },
        {
            title: "Autonomous Agricultural Robotics",
            description: "AI-driven agricultural robots are revolutionizing labor-intensive tasks through autonomous operation. These machines handle planting, weeding, spraying, and harvesting with precision that reduces chemical use by up to 90% compared to traditional methods. Advanced robots can identify and treat individual plants differently based on their specific needs.",
            image: aiRobotics,
            icon: <Cpu className="w-8 h-8" />
        },
        {
            title: "Natural Language Processing for Knowledge Access",
            description: "Natural Language Processing (NLP) systems allow farmers to access complex agricultural knowledge through simple voice commands or text queries. These AI assistants can interpret questions in plain language, delivering expert advice on crop management, pest control, weather implications, and market conditions tailored to the specific farm context.",
            image: nlpSystems,
            icon: <Code className="w-8 h-8" />
        },
        {
            title: "Cloud-Based AI Analytics Platform",
            description: "Cloud computing platforms integrate data from multiple sources across the farm and process it through sophisticated AI algorithms. These systems provide centralized intelligence, turning disconnected data points into actionable insights delivered through user-friendly dashboards. Farmers can make data-driven decisions from anywhere using smartphones or computers.",
            image: cloudComputing,
            icon: <Cloud className="w-8 h-8" />
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
            <section className="relative h-screen overflow-hidden bg-gradient-to-br from-green-600 to-green-800">
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                >
                    <img
                        src={aiHero}
                        alt="AI technology in agriculture"
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
                        Agricultural Intelligence
                    </motion.h1>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-green-300 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        AI-Powered Farming Solutions
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-100 max-w-3xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Artificial intelligence is transforming agriculture with data-driven insights, autonomous operations, and predictive capabilities that increase yields by up to 35% while dramatically reducing resource waste.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <a href="#features" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Technologies
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
                        The Impact of AI in Agriculture
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
                        Key AI Technologies for Smart Farming
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
                        Why AI is Revolutionizing Agriculture
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
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                AI systems analyze millions of data points to provide insights that would be impossible for humans to discover, enabling farmers to make precision decisions that optimize every aspect of crop production.
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
                                    <Server className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Autonomous Operations</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                AI-powered autonomous systems reduce labor requirements while improving precision, allowing farms to operate efficiently even with workforce shortages and increasing labor costs.
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
                                    <Database className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Sustainable Resource Use</h3>
                            </div>
                            <p className="text-black text-opacity-90">
                                Predictive AI models optimize the use of water, fertilizers, and pesticides, reducing environmental impact while maintaining or increasing yields to meet growing global food demands.
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
                        Emerging AI Agricultural Technologies
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
                                <Cpu className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Swarm Robotics</h3>
                                <p className="text-gray-600">
                                    Networks of small, specialized AI-powered robots are being developed to work collaboratively across fields, performing tasks like planting, weeding, and harvesting with unprecedented precision and efficiency.
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
                                <Code className="w-20 h-20 text-green-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Digital Twin Technology</h3>
                                <p className="text-gray-600">
                                    AI-powered digital twins create virtual replicas of entire farms, allowing farmers to test different scenarios and management strategies in a simulated environment before implementing them in the real world.
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
                        Implementation Challenges
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
                                        <span>Integration Complexity</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Integrating AI systems with existing farm equipment and practices requires significant planning and often custom solutions. Standardization efforts and plug-and-play AI modules are making adoption easier.
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
                                        <span>Data Quality & Access</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        AI systems require large amounts of high-quality data, which can be difficult to collect in remote agricultural areas. Improving rural connectivity and developing offline AI capabilities are addressing this challenge.
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
                                        <span>Training & Skills Gap</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        Many farmers lack the technical background to fully leverage AI solutions. Educational programs and increasingly intuitive user interfaces are helping bridge this knowledge gap.
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
                                        <span>Investment Requirements</span>
                                    </h3>
                                    <p className="text-gray-600">
                                        The initial cost of implementing comprehensive AI systems can be prohibitive for small and medium-sized farms. Emerging subscription models and government incentives are making these technologies more accessible.
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
                        Ready to Transform Your Farm with AI?
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 observe-me"
                        id="cta-text"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['cta-text'] ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        The future of agriculture is intelligent, data-driven, and sustainable. Our AI solutions can help your farm increase productivity, reduce costs, and prepare for the challenges of tomorrow's agriculture.
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
                                Request Assessment
                            </a>
                            <a
                                href="#learn-more"
                                className="bg-transparent hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 border-2 border-white hover:border-blue-300"
                            >
                                Download AI Guide
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

export default AiSolutions;