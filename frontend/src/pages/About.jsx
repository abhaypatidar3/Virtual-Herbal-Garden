import React from "react";
import aboutImg from "../assets/vertical_image.jpg";
import teamImg from "../assets/verticle_image2.jpg";
import logo from "../assets/VHG_logo.png";

const About = () => {
  return (
    <div className="bg-[#E1EEBC] w-full overflow-x-hidden font-itim text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] bg-[url('src/assets/expPlants.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative text-center z-10 px-6 sm:px-12">
          <h1 className="text-5xl sm:text-7xl text-white font-itim mb-6">
            About <span className="text-[#C8E6C9]">AYUSH</span>
          </h1>
          <p className="text-lg sm:text-2xl text-white max-w-3xl mx-auto">
            Rooted in the timeless wisdom of Ayurveda, AYUSH brings you closer
            to nature’s healing power — blending tradition, sustainability, and
            modern wellness.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="flex flex-col sm:flex-row items-center justify-center py-20 px-[8vw] gap-12 bg-[#F6FFE0]">
        <div className="sm:w-1/2 flex justify-center">
          <img
            src={aboutImg}
            alt="about-us"
            className="rounded-3xl shadow-lg border border-gray-300 w-[90%] sm:w-[80%]"
          />
        </div>
        <div className="sm:w-1/2 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl text-[#306203] mb-6">
            Who We Are
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed">
            We’re a community of plant enthusiasts, herbal experts, and
            eco-conscious innovators dedicated to bringing Ayurvedic wisdom into
            every home. At AYUSH, we aim to empower individuals to embrace
            holistic living through medicinal plants and sustainable
            cultivation practices.
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="flex flex-col-reverse sm:flex-row items-center justify-center py-20 px-[8vw] gap-12 bg-[#EAFFD8]">
        <div className="sm:w-1/2 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl text-[#306203] mb-6">
            Our Vision
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed">
            To create a world where ancient herbal knowledge meets modern
            innovation — fostering wellness that’s natural, accessible, and
            sustainable. We envision a future where every home grows green and
            heals naturally.
          </p>
        </div>
        <div className="sm:w-1/2 flex justify-center">
          <img
            src={teamImg}
            alt="vision"
            className="rounded-3xl shadow-lg border border-gray-300 w-[90%] sm:w-[80%]"
          />
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-[8vw] bg-[#F6FFE0] text-center">
        <h2 className="text-4xl sm:text-5xl text-[#306203] mb-12">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-lg sm:text-xl">
          <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl text-[#556B2F] mb-3">🌱 Sustainability</h3>
            <p>
              We cultivate with care, ensuring our practices protect the planet
              and future generations.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl text-[#556B2F] mb-3">🌿 Authenticity</h3>
            <p>
              Every product and plant we share stays true to Ayurvedic
              traditions and natural integrity.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl text-[#556B2F] mb-3">💧 Well-being</h3>
            <p>
              Our mission is to nurture health, happiness, and harmony through
              the healing power of nature.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-[#008080]/80 to-[#556B2F]/80 text-white text-center px-[6vw]">
        <h2 className="text-4xl sm:text-5xl mb-6">Get in Touch</h2>
        <p className="text-lg sm:text-2xl max-w-3xl mx-auto mb-8">
          Have a question or want to collaborate? We’d love to hear from you.
          Let’s grow together — naturally.
        </p>
        <button className="bg-[#C8E6C9] text-[#306203] text-xl font-itim py-3 px-10 rounded-3xl hover:bg-white hover:scale-105 transition">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#E1EEBC] text-center py-6 flex flex-col items-center">
        <img src={logo} alt="logo" className="w-[100px] mb-3 rounded-xl" />
        <p className="text-gray-700 font-itim text-sm sm:text-base">
          © 2025 AYUSH | Healing with Nature 🌿
        </p>
      </footer>
    </div>
  );
};

export default About;
