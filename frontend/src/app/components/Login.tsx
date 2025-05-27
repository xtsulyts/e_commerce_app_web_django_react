"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex"
import Home from "../pages/home/Home";
//import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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

function Login() {
  const { loginUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  /**
     * Estado que almacena los productos en el carrito
     * @type {[Producto[], React.Dispatch<React.SetStateAction<Producto[]>>]}
     */
    const [carrito, setCarrito] = useState<Producto[]>([]);
  
    /**
     * Función para agregar productos al carrito
     * @function handleAgregarCarrito
     * @param {Producto} producto - Producto a agregar al carrito
     * @returns {void}
     */
    const handleAgregarCarrito = (producto: Producto): void => {
      setCarrito([...carrito, producto]);
    };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(null);

    try {
      await loginUser(email, password);
      router.push("./pages/home");
    } catch (err: any) {
      setError(err.message);
      console.log(error)
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleLogin}>
        <h1 className="text-xl font-bold text-center mb-6">Inicia Sesión</h1>

        <input
          type="email"
          placeholder="Usuario/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-4"
        >
          Iniciar Sesión
        </button>
        
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">o</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
   
       
    </div>
  );
}

export default Login;
























