import React from "react";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 px-4 py-16">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-6">About CafeVerse</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Where coffee meets community, and every cup tells a story.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-orange-900 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            CafeVerse was born from a simple dream: to create a space where people could connect over great coffee and meaningful conversations. What started as a small corner cafe has grown into a beloved community hub.
          </p>
        </div>
        <div>
          <img
            src="/chai_latte.jpg"
            alt="Cafe interior"
            className="rounded-xl shadow-lg w-full h-64 object-cover"
          />
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-white/70 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☕</span>
            </div>
            <h3 className="font-semibold text-orange-900 mb-2">Quality First</h3>
            <p className="text-gray-600 text-sm">
              We never compromise on quality. From bean selection to brewing methods, every detail matters.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold text-orange-900 mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              Building connections and fostering relationships through shared experiences and conversations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="font-semibold text-orange-900 mb-2">Sustainability</h3>
            <p className="text-gray-600 text-sm">
              Committed to eco-friendly practices and supporting sustainable coffee farming communities.
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/70 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-3">Specialty Coffee</h3>
            <p className="text-gray-600 mb-4">
              Our expert baristas craft the perfect cup using premium beans and traditional brewing methods. From classic espresso to innovative specialty drinks.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Single-origin coffees</li>
              <li>• Artisanal brewing methods</li>
              <li>• Seasonal specialties</li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-3">Fresh Pastries</h3>
            <p className="text-gray-600 mb-4">
              Baked fresh daily in our kitchen using traditional recipes and the finest ingredients. Perfect companions to your coffee.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Artisan breads</li>
              <li>• Sweet pastries</li>
              <li>• Gluten-free options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">A Glimpse of CafeVerse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src="/cafe1.jpg"
            alt="Coffee cup"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
          <img
            src="/cafe2.jpg"
            alt="Barista at work"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
          <img
            src="/cafe3.jpg"
            alt="Cafe atmosphere"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
          <img
            src="/cafe4.jpg"
            alt="Coffee cup"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
          <img
            src="/cafe5.jpg"
            alt="Barista at work"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
          <img
            src="/cafe6.jpg"
            alt="Cafe atmosphere"
            className="rounded-xl shadow-lg object-cover w-full h-48"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-700 mb-4">
          Ready to experience CafeVerse for yourself?
        </p>
        <a
          href="/menu"
          className="inline-block bg-orange-900 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-orange-700 transition"
        >
          View Our Menu
        </a>
      </div>
    </div>
  </div>
);

export default About; 