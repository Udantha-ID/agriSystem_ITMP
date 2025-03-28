import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">GREEN SOIL</h3>
            <p className="mb-4">Empowering farmers with smart technology solutions for sustainable agriculture.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Blog & News</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Career</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">Smart Farming</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Digital Marketplace</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Climate Monitoring</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Land Mapping</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Crop Management</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1" />
                <p>Nattandiya</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <p>032 2051310</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <p>Greensoil@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Green Soil. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-green-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;