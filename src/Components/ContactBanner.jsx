import React from 'react';
import { Phone } from 'lucide-react';

function ContactBanner() {
  const phoneNumber = "0322051310"; // Replace with the desired phone number

  const handleCallClick = () => {
    // When clicked, navigate to the phone dialer with the phone number
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div>
      {/* Contact Section */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Assistance? Get in Touch!</h2>
          <p className="text-gray-700 mb-6">
            Our team is here to help you with any inquiries about our platform and services.
          </p>
          <button
            onClick={handleCallClick}  // Attach the onClick handler
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Phone className="w-5 h-5" /> Call Us Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default ContactBanner;
