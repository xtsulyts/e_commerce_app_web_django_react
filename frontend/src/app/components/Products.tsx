import React from "react";
import Boton from "./Boton";
import "../components/estilos/productos.css";

/**
 * Interface para representar un producto
 * @interface Producto
 * @property {string | number} codigo - Código único identificador del producto
 * @property {string} nombre - Nombre completo del producto
 * @property {number} precio - Precio en unidades monetarias
 * @property {number} cantidad - Unidades disponibles en stock
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
 * Props del componente Productos
 * @interface ProductosProps
 * @property {Producto} producto - Objeto con la información del producto
 * @property {(producto: Producto) => void} agregarCarrito - Función para agregar al carrito
 */
interface ProductosProps {
  producto: Producto;
  agregarCarrito: (producto: Producto) => void;
}

/**
 * Componente que muestra la tarjeta de un producto con su información y acción de compra
 * @param {ProductosProps} props - Propiedades del componente
 * @returns {JSX.Element} Elemento JSX que representa la tarjeta de producto
 */
const Productos: React.FC<ProductosProps> = ({ producto, agregarCarrito }) => {
  /**
   * Determina el mensaje y estilo del stock según la cantidad disponible
   * @function getStockStatus
   * @returns {string} Texto formateado con el estado del stock
   */
  const getStockStatus = () => {
    if (!producto.cantidad) {
      return "🛒 Agotado";
    }
    if (producto.cantidad < 3) {
      return `⚠️ Poco stock (${producto.cantidad})`;
    }
    return `✔️ Disponibles: ${producto.cantidad}`;
  };

  /**
   * Determina la clase CSS según el estado del stock
   * @function getStockClass
   * @returns {string} Nombre de la clase CSS correspondiente
   */
  const getStockClass = () => {
    if (!producto.cantidad) return "agotado";
    if (producto.cantidad < 3) return "poco-stock";
    return "disponible";
  };

  return (
    <div className="galleryContainer">
      <div className="productCard" key={producto.codigo}>
        <div className="cardHeader">
          <span className="productCodigo">#{producto.codigo}</span>
        </div>
        
        <div className="cardBody">
          {producto.imagen && (
            <img
              className="producto-imagen"
              src={producto.imagen}
              alt={producto.nombre || "Imagen del producto"}
              loading="lazy"
            />
          )}
          <h3 className="productoNombre">
            {producto.nombre} - ${producto.precio.toLocaleString()}
          </h3>
          
          <p className={`productCantidad ${getStockClass()}`}>
            {getStockStatus()}
          </p>
        </div>

        <div className="cardFooter">
          <Boton
            tipo="compra"
            onClick={() => agregarCarrito(producto)}
          >
            Comprar
          </Boton>
        </div>
      </div>
    </div>
  );
};

export default Productos;   