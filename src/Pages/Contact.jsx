import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Users
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
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
    let error = '';
    
    if (name === 'name' && !/^[A-Za-z ]*$/.test(value)) {
      error = 'Name can only contain letters';
    }
    if (name === 'phone' && !/^[0-9]*$/.test(value)) {
      error = 'Phone number can only contain numbers';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!errors.name && !errors.phone) {
      console.log('Form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-100 min-h-screen">
      <Navbar />
      <div className="relative bg-gradient-to-br from-green-300 to-green-800 py-32 px-6 text-center">
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

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
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
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
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
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
              <button type="submit" className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all group">
                Send Message
                <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
