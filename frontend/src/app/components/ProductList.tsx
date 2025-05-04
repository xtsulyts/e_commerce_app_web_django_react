import React from "react";
import Productos from "../components/Products";
import "../components/estilos/gallery.css";

/**
 * Interface para las propiedades del componente ListaProductos
 * @interface ListaProductosProps
 * @property {Producto[]} productos - Lista de productos a mostrar
 * @property {(producto: Producto) => void} agregarCarrito - Función para agregar productos al carrito
 */
interface ListaProductosProps {
  productos: Producto[];
  agregarCarrito: (producto: Producto) => void;
}

/**
 * Componente que muestra una lista de productos en formato de galería
 * @function ListaProductos
 * @param {ListaProductosProps} props - Propiedades del componente
 * @returns {JSX.Element} Contenedor con la lista de productos renderizados
 * 
 * @example
 * <ListaProductos
 *   productos={productosLista}
 *   agregarCarrito={agregarAlCarrito}
 * />
 */
const ListaProductos: React.FC<ListaProductosProps> = ({ 
  productos, 
  agregarCarrito 
}) => {
  return (
    <div className="galleryContainer">
      {productos.map((producto: Producto) => (
        <Productos 
          key={producto.codigo}
          producto={producto} 
          agregarCarrito={agregarCarrito}
        />
      ))}
    </div>
  );
};

export default ListaProductos;