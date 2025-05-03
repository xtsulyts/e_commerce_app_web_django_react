/**
 * Interface que representa la estructura de un producto
 * @interface Producto
 * @property {number | string} id - Identificador único del producto
 * @property {number | string} codigo - Código de referencia del producto
 * @property {string} nombre - Nombre completo del producto
 * @property {number} cantidad - Cantidad disponible en stock
 * @property {number} precio - Precio en pesos chilenos (CLP)
 * @property {string} imagen - URL de la imagen del producto
 */
interface Producto {
  id: number | string;
  codigo: number | string;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
}

/**
 * Lista de productos de ejemplo para propósitos de demostración
 * @constant {Producto[]} productosLista
 * @type {Producto[]}
 * 
 * @example
 * [
 *   {
 *     id: 1,
 *     codigo: 1001,
 *     nombre: 'Producto A',
 *     cantidad: 2,
 *     precio: 150000,
 *     imagen: 'https://example.com/imagen.jpg'
 *   },
 *   // ... más productos
 * ]
 */
export const productosLista: Producto[] = [
  { 
    id: 1, 
    codigo: 1001, 
    nombre: 'Producto A', 
    cantidad: 2, 
    precio: 150000, 
    imagen: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg' 
  },
  { 
    id: 2, 
    codigo: 1002, 
    nombre: 'Producto B', 
    cantidad: 0, 
    precio: 90000, 
    imagen: 'https://images.pexels.com/photos/19090/pexels-photo.jpg' 
  },
  { 
    id: 3, 
    codigo: 1003, 
    nombre: 'Producto C', 
    cantidad: 8, 
    precio: 80000, 
    imagen: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg' 
  },
  { 
    id: 4, 
    codigo: 1004, 
    nombre: 'Producto D', 
    cantidad: 5, 
    precio: 45000, 
    imagen: 'https://images.pexels.com/photos/292998/pexels-photo-292998.jpeg' 
  },
  { 
    id: 5, 
    codigo: 1005, 
    nombre: 'Producto E', 
    cantidad: 3, 
    precio: 70000, 
    imagen: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg' 
  },
  { 
    id: 7,  // Nota: Secuencia numérica irregular
    codigo: 1006, 
    nombre: 'Producto F', 
    cantidad: 8, 
    precio: 120000, 
    imagen: 'https://images.pexels.com/photos/3602449/pexels-photo-3602449.jpeg' 
  },
  { 
    id: 8, 
    codigo: 1007, 
    nombre: 'Producto G', 
    cantidad: 8, 
    precio: 90000, 
    imagen: 'https://images.pexels.com/photos/1750045/pexels-photo-1750045.jpeg' 
  },
  { 
    id: 9, 
    codigo: 1008, 
    nombre: 'Producto H', 
    cantidad: 8, 
    precio: 11000, 
    imagen: 'https://images.pexels.com/photos/3782789/pexels-photo-3782789.jpeg' 
  },
];