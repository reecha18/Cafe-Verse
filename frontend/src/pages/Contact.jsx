import React from 'react';
import ContactSection from '../components/ContactSection';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:pt-32">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#4E2E0E]">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          We'd love to hear from you!
        </p>
      </div>

      {/* Renders the contact form and info section */}
      <ContactSection />
    </div>
  );
};

export default Contact;