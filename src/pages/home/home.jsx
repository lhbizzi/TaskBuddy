import React from "react";
import Navbar from "../../components/navbar/navbar";
import "./home.css";
import Sidebar from "../../components/sidebar/sidebar";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <Sidebar />
      <h1>Home</h1>
    </div>
  );
};

export default Home;
