'use client'

//import React, { useState, useEffect } from 'react';
import { UserProvider } from './contex/UserContex';
import Auth from './components/Auth';
import Header from './components/Header';




/**
 * Componente raíz de la aplicación que maneja el estado global del carrito
 * @function App
 * @returns {JSX.Element} Componente principal que envuelve toda la aplicación
 */
const App: React.FC = () => {



  return (
    <>
    <UserProvider>
    <Header/>
    <Auth/>
    </UserProvider>
    </>
  );
};

export default App;