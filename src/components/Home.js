import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/T_logo.png";
import cloud1 from "../assets/cloud.png";
import cloud2 from "../assets/cloud.png";
import cycle from "../assets/cycle.png";

export default function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/explore");
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-img" />
          <div className="navbar-title">TravAI</div>
        </div>
      </nav>

      {/* Clouds */}
      <img src={cloud1} alt="cloud" className="cloud cloud1" />
      <img src={cloud2} alt="cloud" className="cloud cloud2" />

      {/* Hero Section */}
      <div className="hero">
        <h1>Travel Recommendation System</h1>
        <p>
          A smart way to explore your favorite destinations based on your preferences.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleExploreClick}>
            Get Started
          </button>
        </div>
      </div>

      {/* Cycle Image at Bottom Right */}
      <div className="image-below">
        <img src={cycle} alt="Cycle" className="cycle-img" />
      </div>
    </div>
  );
}
