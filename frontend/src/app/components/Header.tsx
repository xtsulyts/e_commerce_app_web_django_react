"use client"

import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShopify, FaSearch, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import React from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const menuItems = ['Categorías', 'Ofertas', 'Nuevos', 'Más Vendidos', 'Tiendas Oficiales', 'Ayuda'];

  useEffect(() => {
    setMounted(true);
    console.log("Tema actual:", theme); 
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Placeholder mientras carga */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

  
  return (

    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      {/* Primera fila */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaShopify className="text-yellow-500 text-2xl dark:text-yellow-300" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">E-Commerce</h1>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex-1 max-w-md mx-6">
          <FaSearch className="text-gray-500 mr-2 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => console.log("Click perfil")}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
            aria-label="Perfil"
          >
            <FaUser />
          </button>
          <button 
        onClick={toggleDarkMode}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
        aria-label="Alternar modo oscuro"
      >
        {theme === "dark" ? (
          <FaSun className="text-xl" />
        ) : (
          <FaMoon className="text-xl" />
        )}
      </button>
        </div>
      </div>

      {/* Segunda fila - Menú responsive */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {/* Versión desktop */}
        <div className="max-md:hidden container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide justify-center flex space-x-6">
          {menuItems.map((item) => (
            <button
              key={item}
              className="whitespace-nowrap px-1 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              onClick={() => console.log(`Click ${item}`)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Versión móvil */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex justify-between items-center px-4 py-2 text-gray-700 dark:text-gray-300"
          >
            <span className="text-sm font-medium">Menú</span>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {isMobileMenuOpen && (
            <div className="bg-white dark:bg-gray-800 px-4 pb-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className="w-full text-left py-2 px-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
                  onClick={() => {
                    console.log({item});
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;