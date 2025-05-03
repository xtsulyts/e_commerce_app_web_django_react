"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "../contex/UserContex";

const AuthComponent = () => {
  // Hooks para acceder a datos del usuario y enrutamiento
  const { totalIngresos, totalGastos, saldoTotal, user, logoutUser } =
    useUser();
  const router = useRouter();
  // Estados para gestionar el formulario y errores
  const [showForm, setShowForm] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
 

  // Función para manejar el registro
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Solicitud HTTP al servidor
    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      // Manejo de respuesta exitosa
      if (response.status === 201) {
        alert("Usuario creado con éxito");
        setShowForm(null); // Oculta el formulario
        router.push("./"); // Redirige al usuario
      }
    } catch (error: any) {
      // Manejo de errores
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Almacena errores del servidor
      } else {
        alert("Error en el registro. Revisa los datos."); // Alerta genérica
      }
    }
   
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logoutUser(); // Llama a la función de logout del contexto

    console.log("Usuario cerró sesión", user);
  };

  return (
    
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Ruta de la imagen de fondo
    >
      
      {/* Navbar */}

      <div className="relative min-h-screen flex items-center justify-center">
        {/* Fondo (opcional, si quieres que el fondo sea una imagen o tenga un color) */}
        <div className="absolute inset-0 bg-[url('/ruta/a/tu/imagen.jpg')] bg-cover bg-center blur-sm"></div>

        {/* Card transparente con fondo difuminado */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Logo */}

          {/* Título "Your Financial" */}
          <h2 className="text-6xl font-bold text-gray-800 mb-8">
            Tus Finanzas
          </h2>

          <strong className="text-lg text-gray-700">
            Así están tus consumos:
          </strong>
          <span className="text-blue-600 font-semibold text-xl">
            {user?.user}
          </span>

          {/* Contenido de la card */}
          <div className="space-y-4">
           
      
          </div>
        </div>
      </div>

      <div className="absolute top-5 right-5 flex gap-4">
        {!user && ( // Solo mostrar "Regístrate" si no hay usuario logueado
          <button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
            onClick={() => setShowForm("signup")}
          >
            Regístrate
          </button>
        )}
    <button
  className={`
    relative overflow-hidden
    px-6 py-3 
    rounded-lg 
    font-bold 
    text-white 
    shadow-lg
    transition-all 
    duration-300
    ${user 
      ? "bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/30" 
      : "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/30"
    }
    hover:shadow-xl
    hover:scale-105
    active:scale-95
    group
  `}
  onClick={user ? handleLogout : () => setShowForm("login")}
>
  <span className="relative z-10">
    {user ? "Cerrar sesión" : "Iniciar sesión"}
  </span>
  <span className={`
    absolute inset-0 
    bg-white 
    opacity-0 
    group-hover:opacity-10
    transition-opacity
    duration-300
  `}></span>
</button>
      </div>

      {/* FORMULARIO */}
      {(showForm === "signup" || showForm === "login") && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
          
          <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <Nav/>  
            {showForm === "signup" ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Registro de Usuario
                </h2>

                {[
                  {
                    label: "Nombre de Usuario",
                    value: username,
                    setValue: setUsername,
                    error: errors.username,
                  },
                  {
                    label: "Correo Electrónico",
                    value: email,
                    setValue: setEmail,
                    error: errors.email,
                  },
                  {
                    label: "Contraseña",
                    value: password,
                    setValue: setPassword,
                    error: errors.password1,
                    type: "password",
                  },
                  {
                    label: "Confirmar Contraseña",
                    value: confirmPassword,
                    setValue: setConfirmPassword,
                    error: errors.password2,
                    type: "password",
                  },
                ].map(({ label, value, setValue, error, type = "text" }) => (
                  <div className="w-full mb-4" key={label}>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      className={`border p-3 w-full rounded-md ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                  </div>
                ))}

                <button
                  type="submit"
                  onClick={handleRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Registrarse
                </button>
                <button
                  onClick={() => setShowForm(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
                >
                  Volver
                </button>
              </>
            ) : (
              <>
                <Login></Login>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;