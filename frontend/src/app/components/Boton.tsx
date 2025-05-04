import React from "react";

/**
 * Props del componente Boton
 * @interface BotonProps
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick - Manejador de eventos click
 * @property {React.ReactNode} children - Contenido del botón
 * @property {"compra" | "login" | "eliminar" | "finalizarCompra" | ""} [tipo=""] - Tipo de estilo del botón
 */
interface BotonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  tipo?: keyof typeof tipoStyles | "";
}

// Objeto de estilos con tipado explícito
const tipoStyles = {
  compra: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  login: "bg-gray-800 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
  eliminar: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  finalizarCompra: "mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
} as const;

/**
 * Componente de botón personalizable
 * @param {BotonProps} props - Propiedades del componente
 * @returns {JSX.Element} Elemento JSX del botón
 */
const Boton: React.FC<BotonProps> = ({ 
  onClick, 
  children, 
  tipo = "" 
}) => {
  // Estilos base
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Tipo seguro para acceder a los estilos
  const tipoActual: keyof typeof tipoStyles = tipo || "compra";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${tipo ? tipoStyles[tipoActual] : ""}`}
    >
      {children}
    </button>
  );
};

export default Boton;