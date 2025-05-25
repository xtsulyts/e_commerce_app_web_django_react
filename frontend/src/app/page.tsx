'use client'

import React, { useState } from 'react';
import { UserProvider } from './contex/UserContex';
import Home from './pages/home/Home';
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
interface Producto {
  codigo: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

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
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const [productos, setProductos] = useState([]);// Array que contiene todos los productos disponibles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);// Null cuando no hay error, string con mensaje de error cuando ocurre uno
  const [imagenes, setImagenes] = useState([]);// Array que contiene las imágenes obtenidas de Pexels API

  /**
   * Función para agregar productos al carrito
   * @function handleAgregarCarrito
   * @param {Producto} producto - Producto a agregar al carrito
   * @returns {void}
   */
  
   /**
   * Efecto secundario para cargar datos al montar el componente
   * Se ejecuta una vez al montar el componente (dependencias vacías [])
   */
  useEffect(() => {
    /**
     * Función asíncrona para obtener datos de las APIs
     * Realiza dos peticiones simultáneas:
     * 1. A Pexels API para obtener imágenes de zapatillas
     * 2. A MockAPI para obtener datos de productos
     */
    const fetchData = async () => {
      try {
         // Iniciar estado de carga y limpiar errores previos
        setLoading(true);
        setError(null);

        // Hacer ambas llamadas a API simultáneamente
        const [imagesResponse, productosResponse] = await Promise.all([
          fetch(
            "https://api.pexels.com/v1/search?query=sneakers&per_page=148",
            {
              headers: { Authorization: API_KEY },
            }
          ),
          fetch("https://67f5e9af913986b16fa5e489.mockapi.io/api/products"),
        ]);

        // Verificar respuestas
        if (!imagesResponse.ok) throw new Error("Error en API de imágenes");
        if (!productosResponse.ok) throw new Error("Error en API de salones");

        // Convertir a JSON
        const [imagesData, productosData] = await Promise.all([
          imagesResponse.json(),
          productosResponse.json(),
        ]);

        // Guardar las imágenes por separado
        setImagenes(imagesData.photos);
        //console.log(imagesResponse);
        //console.log(productosResponse);

        // Combinar datos
        const combinedData = productosData.map((producto, index) => {

          // Usar módulo para ciclar las imágenes si hay más productos que imágenes
          const imageIndex = index % imagesData.photos.length;
          return {
            ...producto,// Spread operator para mantener todas las propiedades del producto

            imagen:// Asignar la imagen correspondiente o una imagen por defecto si no hay
              imagesData.photos[imageIndex]?.src.medium ||
              "https://via.placeholder.com/300",
          };
        });

        setProductos(combinedData); // Actualizar el estado de productos con los datos combinados
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally { // Finalizar carga independientemente del resultado
        setLoading(false);
      }
    };
    console.log(error);

    fetchData();// Llamar a la función para obtener datos
  }, []);// Array de dependencias vacío para que solo se ejecute al montar


  /**
   * Función para agregar productos al carrito
   * @param {Object} producto - El producto a agregar
   * @param {number} cantidad - La cantidad del producto a agregar
   */
  const handleAgregarCarrito = (producto, cantidad) => {
    //console.log("Producto a agregar:", producto);

    // Actualizar el estado del carrito usando el callback del setter
    // Esto asegura que tenemos el estado más actualizado
    setCarrito((prevItem = []) => { // Valor por defecto para prevItem en caso de ser null/undefined
      
      const itemExistente = (prevItem || []).find(
        (item) => item?.nombre === producto?.nombre
      );

      if (itemExistente) { // Si el producto ya está en el carrito
        // Mapear el carrito y actualizar solo la cantidad del producto existente
        return prevItem.map((item) =>
          item?.nombre === producto?.nombre ? { ...item, cantidad } : item
        );
      } else {
        // Si el producto no está en el carrito, agregarlo
        // Usamos spread operator para mantener los items previos
        return [...(prevItem || []), { ...producto, cantidad }];
      }
    });
  };

  return (
    <>
    <UserProvider>
    <Auth/>
    <Home 
      carrito={carrito} 
      handleAgregarCarrito={handleAgregarCarrito} 
    /> 
    <ProductList productos={  productos}
    </UserProvider>
    </>
  );
};

export default App;