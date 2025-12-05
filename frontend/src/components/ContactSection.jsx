import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ContactSection = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Effect to auto-fill user data if they are logged in
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      // ✅ Use the full, explicit path for the API call.
      await axios.post("/api/feedback/contact/", formData);
      setSubmitted(true);
      setFormData(prevData => ({ ...prevData, message: "" }));
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-[#f3e9e1] to-[#fff] rounded-2xl shadow-lg max-w-4xl mx-auto mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#7B3F00]">CafeVerse Contact</h2>
          
          {/* Thematic Image */}
          <img 
            src="/cafe5.jpg" 
            alt="A welcoming coffee shop scene"
            style={{ width: '100%', height: '300px' }}
            className="rounded-xl shadow-md w-full h-auto object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f3e9e1/7B3F00?text=CafeVerse'; }}
          />

          <p className="text-gray-700 text-lg pt-4">We're here to help! Reach out for any questions, feedback, or just to say hello.</p>
          <div className="space-y-2 text-[#7B3F00] font-semibold">
            <div><span className="font-bold">Email:</span> hello@cafeverse.com</div>
            <div><span className="font-bold">Phone:</span> 9877654321</div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          {submitted && (
            <div className="text-green-600 font-semibold p-3 bg-green-50 rounded-md text-center">
              Thank You For Your Feedback!
            </div>
          )}
          {error && (
            <div className="text-red-600 font-semibold p-3 bg-red-50 rounded-md text-center">
              {error}
            </div>
          )}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border border-[#7B3F00] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B3F00] disabled:bg-gray-100"
            required
            // Disable field if user is logged in to prevent accidental changes
            disabled={!!user} 
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="border border-[#7B3F00] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B3F00] disabled:bg-gray-100"
            required
            disabled={!!user}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={4}
            className="border border-[#7B3F00] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-gradient-to-r from-[#7B3F00] to-[#4E2E0E] text-white font-semibold rounded-full px-6 py-2 shadow hover:from-[#4E2E0E] hover:to-[#7B3F00] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;