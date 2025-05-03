import React from 'react';
import Header from "@/app/components/Header";
//import Auth from '@/app/components/Auth';
import ListaProductos from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';
import Carrito from '@/app/components/Carrito';
import { productosLista } from '@/app/components/utils/data'

/**
 * Interface para representar un producto
 * @interface Producto
 * @property {string | number} codigo - Identificador único del producto
 * @property {string} nombre - Nombre completo del producto
 * @property {number} precio - Precio unitario del producto
 * @property {number} cantidad - Cantidad disponible en inventario
 * @property {string} [imagen] - URL opcional de la imagen del producto
 */
interface Producto {
  codigo: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

/**
 * Props del componente Home
 * @interface HomeProps
 * @property {Producto[]} carrito - Lista de productos en el carrito
 * @property {(producto: Producto) => void} handleAgregarCarrito - Función para agregar productos al carrito
 */
interface HomeProps {
  carrito: Producto[];
  handleAgregarCarrito: (producto: Producto) => void;
}

/**
 * Componente principal que representa la página de inicio
 * @param {HomeProps} props - Propiedades del componente
 * @returns {JSX.Element} Estructura principal de la aplicación
 */
const Home: React.FC<HomeProps> = ({ carrito, handleAgregarCarrito }) => {
  
  return (
    <>
      <Header />
      
      <ListaProductos 
        productos = {productosLista}
        agregarCarrito={handleAgregarCarrito}
        />
      <Carrito carritoItems={carrito} />
      <Footer />
    </>
  );
};

export default Home;