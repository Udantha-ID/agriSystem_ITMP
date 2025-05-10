import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, BarChart2, Droplet, Zap, Search, Layers } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// Import images (assuming the same imports as before)
import droneMonitoringImg from '../../Images/SmartFarm/drone.png';
import droneMapping from '../../Images/SmartFarm/drone_map.png';
import droneplant from '../../Images/SmartFarm/drone_seed.jpg';
import dronespray from '../../Images/SmartFarm/drone_crops.jpeg';
import dronelive from '../../Images/SmartFarm/drone_live.jpg';
import droneAI from '../../Images/SmartFarm/drone_Ai.png';
import droneIrrigation from "../../Images/SmartFarm/Drone_Irrigation.jpeg";
import dronePollination from "../../Images/SmartFarm/drone_pollination.jpg";

function Drone() {
    // State for the image carousel
    const [activeSlide, setActiveSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const observedElements = useRef({});

    // Stats for data visualization section
    const stats = [
        { value: '$4.8B', label: 'Market size by 2024', icon: <BarChart2 /> },
        { value: '400K', label: 'Trees planted per day', icon: <Layers /> },
        { value: '30%', label: 'Agricultural spraying in S. Korea', icon: <Droplet /> },
        { value: 'mm', label: 'Precision level achieved', icon: <Search /> },
    ];

    // Applications data
    const applications = [
        {
            title: "Scouting and Monitoring Plant Health",
            description: "Drones equipped with specialized sensors, such as Normalized Difference Vegetation Index (NDVI), analyze plant health by detecting variations in color and light reflection. This allows farmers to identify stressed or diseased crops early, enabling timely intervention.",
            image: droneMonitoringImg,
            icon: <Search className="w-8 h-8" />
        },
        {
            title: "Monitoring Field Conditions",
            description: "Drones generate detailed field maps, including elevation data, which helps farmers assess soil health, drainage patterns, and moisture levels. Some advanced drones even measure nitrogen content in the soil, allowing for precise fertilizer application.",
            image: droneMapping,
            icon: <Layers className="w-8 h-8" />
        },
        {
            title: "Planting and Seeding",
            description: "Although still in early adoption, drone seeders are revolutionizing reforestation efforts and could soon transform crop planting. Automated drone planters can access difficult terrain, reducing labor risks and increasing efficiency.",
            image: droneplant,
            icon: <Droplet className="w-8 h-8" />
        },
        {
            title: "Spray Application",
            description: "In regions like Southeast Asia, drone sprayers are already widely used, with South Korea employing them for 30% of agricultural spraying. Drones excel in hard-to-reach areas, such as steep hillside tea plantations.",
            image: dronespray,
            icon: <Zap className="w-8 h-8" />
        },
        {
            title: "Farm Security and Livestock Monitoring",
            description: "Beyond crop management, drones enhance farm security by monitoring vast areas quickly. They can inspect fences, track equipment, and even locate lost or injured livestock in remote grazing fields.",
            image: dronelive,
            icon: <Info className="w-8 h-8" />
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
            {/* Hero Section with Parallax */}
            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                >
                    <img
                        src={droneAI}
                        alt="Drone over agricultural field"
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
                        The Future of Farming
                    </motion.h1>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-green-300 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Agricultural Drones Revolution
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-100 max-w-3xl mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        The agricultural drone market, valued at $1.2 billion in 2019, is projected to reach $4.8 billion by 2024, transforming precision farming around the world.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <a href="#applications" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Applications
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
                        The Impact of Agricultural Drones
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

            {/* Applications Carousel Section */}
            <section id="applications" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="applications-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['applications-title'] ? "visible" : "hidden"}
                    >
                        Current Applications of Agricultural Drones
                    </motion.h2>

                    <div className="relative">
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex transition-all duration-500 ease-in-out"
                                animate={{ x: `-${activeSlide * 100}%` }}
                                transition={{ type: "tween", ease: "easeInOut" }}
                            >
                                {applications.map((app, index) => (
                                    <div key={index} className="min-w-full">
                                        <div className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                                            <div className="lg:w-1/2 h-72 lg:h-96 overflow-hidden">
                                                <img
                                                    src={app.image}
                                                    alt={app.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                />
                                            </div>
                                            <div className="lg:w-1/2 p-8">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="bg-blue-100 p-3 rounded-full text-green-600">
                                                        {app.icon}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800">{app.title}</h3>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{app.description}</p>
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
                            onClick={() => setActiveSlide(prev => Math.min(applications.length - 1, prev + 1))}
                            disabled={activeSlide === applications.length - 1}
                            className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 ${activeSlide === applications.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronRight className="w-6 h-6 text-green-600" />
                        </button>

                        {/* Indicators */}
                        <div className="flex justify-center mt-8 gap-2">
                            {applications.map((_, index) => (
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

            {/* Emerging Technologies Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="emerging-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['emerging-title'] ? "visible" : "hidden"}
                    >
                        Emerging Drone Technologies in Agriculture
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Tech 1 */}
                        <motion.div
                            className="bg-white rounded-xl shadow-xl overflow-hidden observe-me"
                            id="tech-1"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['tech-1'] ? "visible" : "hidden"}
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={dronePollination} alt="Drone Pollination" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Drone Pollination</h3>
                                <p className="text-gray-600">
                                    Researchers are developing small, delicate drones capable of pollinating plants without damaging them. The next phase involves autonomous pollinator drones that can operate independently.
                                </p>
                            </div>
                        </motion.div>

                        {/* Tech 2 */}
                        <motion.div
                            className="bg-white rounded-xl shadow-xl overflow-hidden observe-me"
                            id="tech-2"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['tech-2'] ? "visible" : "hidden"}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={droneAI} alt="AI in agricultural drones" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">AI and Machine Learning</h3>
                                <p className="text-gray-600">
                                    Improving Artificial Intelligence in drones will enable better recognition of varied crops and growth stages, making the technology more accessible to small farmers in developing nations.
                                </p>
                            </div>
                        </motion.div>

                        {/* Tech 3 */}
                        <motion.div
                            className="bg-white rounded-xl shadow-xl overflow-hidden observe-me"
                            id="tech-3"
                            variants={fadeInUp}
                            initial="hidden"
                            animate={isVisible['tech-3'] ? "visible" : "hidden"}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={droneIrrigation} alt="Drone irrigation technology" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Drone-Assisted Irrigation</h3>
                                <p className="text-gray-600">
                                    Australian researchers are pioneering drone-based microwave sensing to measure soil moisture levels accurately, helping farmers optimize water usage and conserve resources.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Interactive Timeline Section */}
            <section className="py-20 px-4 bg-blue-50">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="timeline-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['timeline-title'] ? "visible" : "hidden"}
                    >
                        Evolution of Agricultural Drones
                    </motion.h2>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

                        {/* Timeline Items */}
                        <div className="space-y-16 relative">
                            {/* Item 1 */}
                            <motion.div
                                className="flex flex-col md:flex-row items-center observe-me"
                                id="timeline-1"
                                variants={fadeInUp}
                                initial="hidden"
                                animate={isVisible['timeline-1'] ? "visible" : "hidden"}
                            >
                                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">2010s</h3>
                                    <p className="text-gray-600">Initial adoption of drones for basic aerial imaging and mapping of agricultural lands.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-green-500 border-4 border-white"></div>
                                <div className="md:w-1/2 md:pl-16">
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <h4 className="text-lg font-semibold text-green-600 mb-2">Key Development</h4>
                                        <p className="text-gray-600">First commercial applications of NDVI sensors for monitoring crop health.</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Item 2 */}
                            <motion.div
                                className="flex flex-col md:flex-row items-center observe-me"
                                id="timeline-2"
                                variants={fadeInUp}
                                initial="hidden"
                                animate={isVisible['timeline-2'] ? "visible" : "hidden"}
                            >
                                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <h4 className="text-lg font-semibold text-green-600 mb-2">Key Development</h4>
                                        <p className="text-gray-600">Widespread adoption of drone spraying technology in East Asia.</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-green-500 border-4 border-white"></div>
                                <div className="md:w-1/2 md:pl-16">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">2018-2020</h3>
                                    <p className="text-gray-600">Integration of drones with farm management software and IoT sensors.</p>
                                </div>
                            </motion.div>

                            {/* Item 3 */}
                            <motion.div
                                className="flex flex-col md:flex-row items-center observe-me"
                                id="timeline-3"
                                variants={fadeInUp}
                                initial="hidden"
                                animate={isVisible['timeline-3'] ? "visible" : "hidden"}
                            >
                                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">2021-Present</h3>
                                    <p className="text-gray-600">Advanced AI capabilities and increasing autonomy in agricultural drone operations.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-green-500 border-4 border-white"></div>
                                <div className="md:w-1/2 md:pl-16">
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <h4 className="text-lg font-semibold text-green-600 mb-2">Key Development</h4>
                                        <p className="text-gray-600">Development of swarm technologies allowing multiple drones to work collaboratively on large farms.</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Item 4 */}
                            <motion.div
                                className="flex flex-col md:flex-row items-center observe-me"
                                id="timeline-4"
                                variants={fadeInUp}
                                initial="hidden"
                                animate={isVisible['timeline-4'] ? "visible" : "hidden"}
                            >
                                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <h4 className="text-lg font-semibold text-green-600 mb-2">Key Development</h4>
                                        <p className="text-gray-600">First commercial deployment of automated pollinator drones and widespread adoption of precision seeding.</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-green-500 border-4 border-white"></div>
                                <div className="md:w-1/2 md:pl-16">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Future (2025+)</h3>
                                    <p className="text-gray-600">Full integration with predictive analytics and autonomous farm management systems.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenges and Future Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 observe-me"
                        id="challenges-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['challenges-title'] ? "visible" : "hidden"}
                    >
                        Challenges and Future Outlook
                    </motion.h2>

                    <div className="bg-gradient-to-r from-green-700 to-green-700 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Challenges */}
                                <motion.div
                                    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-black observe-me"
                                    id="challenges-content"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['challenges-content'] ? "visible" : "hidden"}
                                >
                                    <h3 className="text-2xl font-bold mb-6">Current Challenges</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="bg-red-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Regulatory Barriers</h4>
                                                <p className="text-black-100">Many countries lack clear policies on drone usage, particularly for spraying applications.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-red-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Cost and Accessibility</h4>
                                                <p className="text-black-100">Small-scale farmers may find drone technology prohibitively expensive without adequate financing options.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-red-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Technical Limitations</h4>
                                                <p className="text-black-100">AI and automation need further refinement for diverse farming environments and crop varieties.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* Future */}
                                <motion.div
                                    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-black observe-me"
                                    id="future-content"
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate={isVisible['future-content'] ? "visible" : "hidden"}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-2xl font-bold mb-6">Future Opportunities</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="bg-green-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Regulatory Evolution</h4>
                                                <p className="text-black-100">Growing recognition of agricultural drones' benefits is driving more favorable regulatory frameworks worldwide.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-green-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Decreasing Costs</h4>
                                                <p className="text-black-100">Technology improvements and mass production are steadily reducing costs, opening access to smaller farms.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="bg-green-500 rounded-full p-1 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Autonomous Operation</h4>
                                                <p className="text-black-100">Full autonomy will soon allow drones to operate with minimal human intervention, dramatically increasing efficiency.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conclusion Section with CTA */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-8 observe-me"
                        id="conclusion-title"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['conclusion-title'] ? "visible" : "hidden"}
                    >
                        Join the Agricultural Revolution
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 observe-me"
                        id="conclusion-text"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['conclusion-text'] ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        Agricultural drones are transforming farming practices worldwide, offering unprecedented precision, efficiency, and sustainability. The technology continues to evolve rapidly, with new applications emerging every year.
                    </motion.p>

                    <motion.div
                        className="observe-me"
                        id="conclusion-cta"
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible['conclusion-cta'] ? "visible" : "hidden"}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="#contact"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Get Started with Drones
                            </a>
                            <a
                                href="#learn-more"
                                className="bg-transparent hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full inline-block transition-all duration-300 border-2 border-white hover:border-blue-300"
                            >
                                Learn More
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

export default Drone;