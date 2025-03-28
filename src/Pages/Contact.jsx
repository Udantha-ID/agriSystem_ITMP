import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Users, 
  Globe
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const contactDetails = [
    {
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: "Email",
      content: "support@greensoil.com",
      gradient: "bg-gradient-to-br from-purple-100 to-indigo-300"
    },
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Phone",
      content: "032-2051310",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-300"
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Headquarters",
      content: "65/1 Nattandiya",
      gradient: "bg-gradient-to-br from-orange-100 to-yellow-200"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-300 to-blue-400 py-32 px-6 text-center">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-purple-200 text-purple-700 rounded-full text-sm font-medium mb-6">
            Reach Out to Us
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">
            Let’s Grow and Succeed Together
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-white opacity-80 leading-relaxed">
            Have a question or need assistance? Our team is ready to help you with your agricultural technology needs.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-8">
            {contactDetails.map((contact, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-8 shadow-lg border border-gray-200 ${contact.gradient} relative overflow-hidden transition-all transform hover:scale-105`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-white opacity-30"></div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg mb-4">
                  {contact.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{contact.title}</h3>
                <p className="text-gray-800">{contact.content}</p>
              </div>
            ))}

            {/* Team Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-pink-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  Our Support Team
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our expert team is available Monday-Friday, 9 AM to 6 PM PST to assist you with any inquiries.
              </p>
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                <span className="ml-4 text-gray-600">+3 More Experts</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your Name"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="you@example.com"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about your agricultural needs..."
                  required
                ></textarea>
              </div>
              <div className="flex items-center">
                <button 
                  type="submit"
                  className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all group"
                >
                  Send Message
                  <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="bg-gradient-to-r from-pink-50 via-indigo-100 to-teal-100 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-purple-200 text-purple-700 rounded-full text-sm font-medium mb-6">
            Our Global Presence
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Agricultural Innovation Across Continents
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Our solutions support farmers worldwide, transforming agricultural practices with technology at every step.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[{ flag: "🇺🇸", country: "United States" }, { flag: "🇮🇳", country: "India" }, { flag: "🇧🇷", country: "Brazil" }, { flag: "🇦🇺", country: "Australia" }].map((location, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{location.flag}</div>
                <h3 className="text-xl font-semibold text-gray-900">{location.country}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
