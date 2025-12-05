import React from "react";
import { Link } from "react-router-dom";


const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1920&q=80"
          alt="CafeVerse Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/30 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <div className="mt-10 flex flex-col items-center">
          {/* <img
            src={cafeLogo}
            alt="Coffee Cup Logo"
            className="w-20 h-20 mb-4 drop-shadow-lg animate-fade-in"
            style={{ filter: 'drop-shadow(0 2px 8px #7a4807b7)' }}
          /> */}
          <h1 className="text-5xl md:text-7xl font-bold mb-20 text-White bg-clip-text ">
            CafeVerse
          </h1>
          <p className="text-xl md:text-2xl text-orange-200 font-light mb-5">
            Where Every Sip Tells a Story
          </p>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our handcrafted beverages, artisanal pastries, and warm atmosphere. 
          Every visit is a journey through flavor and comfort.
        </p>


        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-orange-300 mb-1">Fresh Daily</h3>
            <p className="text-sm text-gray-300">Baked fresh every morning</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-orange-300 mb-1">Made with Love</h3>
            <p className="text-sm text-gray-300">Every cup crafted with care</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-orange-300 mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-300">Multiple payment options</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-orange-300 mb-1">Perfect Location</h3>
            <p className="text-sm text-gray-300">In the heart of the city</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection; 