import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFolder, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsShieldFill } from "react-icons/bs";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Projects", path: "/projectview", icon: <FiFolder /> },
  ];

  return (
    <aside
      className={`
    bg-white shadow-lg h-screen fixed md:static z-50 transition-all duration-300 ease-in-out
    ${isOpen ? "w-64" : "w-16"}
  `}
    >

      <div className="p-2 flex justify-between items-center border-b">
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <BsShieldFill className="text-blue-600" size={20} />
          {isOpen && <span>Invader</span>}
        </span>

        <button
          className="text-gray-700  p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      <nav className={`p-4 space-y-4 text-md text-gray-700 ${!isOpen ? "flex flex-col items-center" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path} // Make sure it's the same case as the route path, e.g., /projectview
            className={`flex items-center gap-3  p-2 rounded-md transition-colors duration-200 
      ${location.pathname === link.path ? "text-blue-600 font-semibold" : "text-gray-800 hover:text-blue-600"}`}
            onClick={() => isOpen || setIsOpen(true)}
            style={{ textDecoration: "none" }}
          >
            {link.icon}
            {isOpen && <span>{link.name}</span>}
          </Link>

        ))}

      </nav>
    </aside>
  );
}
