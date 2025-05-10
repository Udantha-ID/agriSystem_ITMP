import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Bone as Drone, 
  Droplets, 
  Brain, 
  Navigation, 
  Plane as Plant2, 
  Link, 
  BookOpen, 
  BarChart3, 
  Users, 
  Send 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

const technologies = [
  { 
    icon: Drone, 
    title: 'Drone Farming', 
    description: 'Advanced crop monitoring and precision spraying',
    path: '/drone'  // Path added for navigation
  },
  { icon: Droplets, title: 'Smart Irrigation', description: 'IoT-powered water management systems', path: '/irrigation' },
  { icon: Brain, title: 'AI Solutions', description: 'Intelligent farming decisions and predictions', path: '/ai'},
  { icon: Navigation, title: 'GPS Tracking', description: 'Precise field mapping and navigation', path: '/gps'},
  { icon: Plant2, title: 'Vertical Farming', description: 'Space-efficient modern farming methods', path: '/vertical' },
  { icon: Link, title: 'Blockchain', description: 'Transparent supply chain management' }
];

const articles = [
  {
    title: 'The Future of Drone Technology in Agriculture',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200',
    category: 'Technology',
  },
  {
    title: 'Smart Irrigation Systems: A Water-Saving Revolution',
    image: 'https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&w=1200',
    category: 'Innovation'
  },
  {
    title: 'AI-Powered Crop Disease Detection',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200',
    category: 'Artificial Intelligence'
  }
];

function FadeInSection({ children }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

function SmartFarm() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000"
              alt="Smart Farming"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              The Future of Farming
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 mb-8"
            >
              Revolutionizing agriculture with smart technology
            </motion.p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
            >
              Explore Now
            </motion.button>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 px-4 bg-gray-50">
          <FadeInSection>
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Smart Farming Technologies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => tech.path && navigate(tech.path)}
                  >
                    <tech.icon className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                    <p className="text-gray-600">{tech.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Articles Section */}
        <section className="py-20 px-4">
          <FadeInSection>
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span className="text-green-500 text-sm font-semibold">
                        {article.category}
                      </span>
                      <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
                      <button 
                        className="mt-4 text-green-500 font-semibold hover:text-green-600 transition-colors"
                        onClick={() => navigate('/explore')}
                      >
                        Read More →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50">
          <FadeInSection>
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-16">Interactive Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: BookOpen, title: 'Blog Updates' },
                  { icon: BarChart3, title: 'Live Data' },
                  { icon: Users, title: 'Community' },
                  { icon: Send, title: 'Newsletter' }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center"
                  >
                    <feature.icon className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className="font-semibold">{feature.title}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter for the latest smart farming insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </FadeInSection>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default SmartFarm;