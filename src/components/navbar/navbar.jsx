import React from "react";
import "./Navbar.css";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="container_navbar">
      <img src="/src/assets/logo.png" alt="logo" className="logo-tb-nav" />
      <FaRegUserCircle className="user-icon" />
      <div className="sidebar"></div>
    </div>
  );
};

export default Navbar;
