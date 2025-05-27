'use client'

import React, { useState } from 'react';
import { UserProvider } from './contex/UserContex';
import Inicio from "@/app/pages/HomePages"
import Auth from './components/Auth';
//import './index.css';


/**
 * Interface para representar un producto en la aplicación
 * @interface Producto
 * @property {string | number} codigo - Identificador único del producto
 * @property {string} nombre - Nombre completo del producto
 * @property {number} precio - Precio unitario en moneda local
 * @property {number} cantidad - Unidades disponibles en inventario
 * @property {string} [imagen] - URL opcional de la imagen del producto
 */
// interface Producto {
//   codigo: string | number;
//   nombre: string;
//   precio: number;
//   cantidad: number;
//   imagen?: string;
// }

/**
 * Componente raíz de la aplicación que maneja el estado global del carrito
 * @function App
 * @returns {JSX.Element} Componente principal que envuelve toda la aplicación
 * 
 * @example
 * <App />
 */
const App: React.FC = () => {
  /**
   * Estado que almacena los productos en el carrito
   * @type {[Producto[], React.Dispatch<React.SetStateAction<Producto[]>>]}
   */
  // const [carrito, setCarrito] = useState<Producto[]>([]);

  /**
   * Función para agregar productos al carrito
   * @function handleAgregarCarrito
   * @param {Producto} producto - Producto a agregar al carrito
   * @returns {void}
   */
  // const handleAgregarCarrito = (producto: Producto): void => {
  //   setCarrito([...carrito, producto]);
  // };

  return (
    <>
    <UserProvider>
    <h1>hhhhhhhhhhhhhhh</h1>
    {/* <Home 
      carrito={carrito} 
      handleAgregarCarrito={handleAgregarCarrito} 
    /> */}
    </UserProvider>
    </>
  );
};

export default App;