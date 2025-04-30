import React from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar.jsx";
import Welcome from "../Components/Welcome.jsx";
import LandBanner from "../Components/LandBanner.jsx";
import Footer from "../Components/Footer.jsx";
import ContactBanner from "../Components/ContactBanner.jsx";


const Home = () => {
  return (
    <div>
      <Navbar />
      <Welcome />
      <LandBanner />
      <ContactBanner />
      <Footer />
    </div>
  );
};

export default Home;
