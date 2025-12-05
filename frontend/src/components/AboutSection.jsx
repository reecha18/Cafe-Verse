import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl  font-bold text-orange-900">
                About CafeVerse
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                CafeVerse is more than just a cafe—it's a community hub for coffee lovers, remote workers, and friends.
                We source the finest beans, bake our pastries fresh daily, and create a welcoming space for everyone.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-900 mb-2">5+</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-900 mb-2">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-900 mb-2">50+</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 bg-[#7B3F00] text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Read More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
        </Link>
      </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/cafe.jpg"
                alt="CafeVerse Interior"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-orange-200 rounded-full opacity-60 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full opacity-60 blur-xl"></div>
          </div>
        </div>


        {/* Payment Methods Section */}
        <div className="bg-gradient-to-br from-[#7B3F00] to-[#4E2E0E] rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Payment Options</h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              We accept all major payment methods for your convenience and security
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Credit Cards</h3>
              <p className="text-orange-100 text-sm">Visa, Mastercard, Amex</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 5 L13 12 L7 19 Z M11 5 L19 12 L11 19 Z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">UPI</h3>
              <p className="text-orange-100 text-sm">Fast & secure payments</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Apple Pay</h3>
              <p className="text-orange-100 text-sm">Touch to pay</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">SSL Secure</h3>
              <p className="text-orange-100 text-sm">256-bit encryption</p>
            </div>
          </div>
        </div>

       
    </div>
  </section>
);
};

export default AboutSection; 