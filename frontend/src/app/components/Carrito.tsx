import React from 'react';
import Boton from "./Boton"

/**
 * Interface para representar un producto en el carrito
 * @interface ProductoCarrito
 * @property {string} nombre - Nombre del producto
 * @property {number} precio - Precio numérico del producto
 */
interface ProductoCarrito {
  nombre: string;
  precio: number;
}

/**
 * Props del componente Carrito
 * @interface CarritoProps
 * @property {ProductoCarrito[]} carritoItems - Lista de productos en el carrito
 */
interface CarritoProps {
  carritoItems: ProductoCarrito[];
}

/**
 * Componente que muestra el carrito de compras con lista de productos y total
 * @param {CarritoProps} props - Propiedades del componente
 * @returns {JSX.Element} Elemento JSX que representa el carrito
 */
const Carrito: React.FC<CarritoProps> = ({ carritoItems }) => {
  /**
   * Calcula el total sumando los precios de todos los items del carrito
   * @type {number}
   */
  const totalCarrito = carritoItems.reduce((total, item) => total + item.precio, 0);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        CARRITO DE COMPRAS
      </h2>

      {carritoItems.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">El carrito está vacío</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {carritoItems.map((item, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="text-gray-700 font-medium">{item.nombre}</span>
              <span className="text-green-600 font-semibold">
                ${item.precio.toLocaleString('es-AR')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {carritoItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">
              ${totalCarrito.toLocaleString('es-AR')}
            </span>
          </div>
          <Boton
            tipo="finalizarCompra"
            onClick={() => console.log("Finalizar Compra")}
          >
            Finalizar Compra
          </Boton>
        </div>
      )}
    </div>
  );
};

export default Carrito;