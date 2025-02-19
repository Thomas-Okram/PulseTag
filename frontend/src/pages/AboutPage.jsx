import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  FaNetworkWired,
  FaCogs,
  FaRocket,
  FaGlobe,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      <Navbar />

      {/* Glowing Background Elements */}
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] opacity-30 top-10 left-20 animate-pulse" />
      <div className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] opacity-30 bottom-10 right-20 animate-pulse delay-2000" />
      <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] opacity-30 top-1/2 left-1/4 animate-pulse delay-4000" />

      {/* Hero Section */}
      <motion.section
        className="text-center py-20 px-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Innovating the Future, One Solution at a Time
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
          From NFC technology to cutting-edge software solutions, we empower
          businesses with next-gen innovations.
        </p>
      </motion.section>

      {/* Who We Are */}
      <motion.section
        className="max-w-5xl mx-auto py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-400">
          Who We Are
        </h2>
        <p className="text-gray-300 text-center mt-4 leading-relaxed">
          We are a team of **visionaries, engineers, and creators** committed to
          transforming industries through innovative technology. Our solutions
          span across **NFC networking, cybersecurity, AI-driven platforms, and
          enterprise software solutions.** Whether it's streamlining business
          operations or revolutionizing digital transactions, we help you stay
          ahead of the curve.
        </p>
      </motion.section>

      {/* Our Core Values */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-purple-400">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            {
              icon: FaShieldAlt,
              title: "Integrity",
              text: "We believe in transparency, honesty, and ethics in everything we do.",
            },
            {
              icon: FaLightbulb,
              title: "Innovation",
              text: "We constantly push boundaries to develop next-gen technologies.",
            },
            {
              icon: FaHandshake,
              title: "Collaboration",
              text: "We work closely with clients to create solutions tailored to their needs.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800/40 backdrop-blur-lg rounded-2xl text-center shadow-lg border border-gray-700 hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.3 }}
            >
              <value.icon className="text-5xl mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold">{value.title}</h3>
              <p className="text-gray-300 text-sm mt-2">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-yellow-400">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {[
            {
              icon: FaNetworkWired,
              title: "NFC & IoT Solutions",
              text: "Transforming business connectivity with NFC-powered smart networking and IoT integration.",
            },
            {
              icon: FaCogs,
              title: "Custom Software Development",
              text: "Building AI-driven applications, enterprise-grade platforms, and automation tools.",
            },
            {
              icon: FaRocket,
              title: "Cybersecurity & Defense",
              text: "Developing military-grade secure communication and data protection solutions.",
            },
            {
              icon: FaGlobe,
              title: "E-commerce & Fintech",
              text: "Creating seamless digital transaction solutions for online businesses and financial services.",
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800/40 backdrop-blur-lg rounded-2xl text-center shadow-lg border border-gray-700 hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.3 }}
            >
              <service.icon className="text-5xl mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-300 text-sm mt-2">{service.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Ready to Build the Future Together?
        </h2>
        <p className="text-gray-300 text-lg mt-4">
          Let's create groundbreaking solutions that push industries forward.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition-all"
        >
          Contact Us
        </a>
      </motion.section>

      <Footer />
    </div>
  );
}
