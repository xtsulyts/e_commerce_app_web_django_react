"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "../contex/UserContex";
import Login from "./Login";
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

type FormErrors = {
  email?: string;
  password?: string;
  // ...otros campos
};

const Auth = () => {
  // Hooks para acceder a datos del usuario y enrutamiento
  const { user, logoutUser } =
    useUser();
  const router = useRouter();
  // Estados para gestionar el formulario y errores
  const [showForm, setShowForm] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
 

  // Función para manejar el registro
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Solicitud HTTP al servidor
    try {
      const response = await axios.post("http://localhost:8000/register/", {
        username,
        email,
        password: password,
        password_confirmation: confirmPassword,
      });
      // Manejo de respuesta exitosa
      if (response.status === 201) {
        alert("Usuario creado con éxito");
        setShowForm(null); // Oculta el formulario
        router.push("./pages/home"); // Redirige al usuario
      }
    } catch (error: any) {
      // Manejo de errores
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Almacena errores del servidor
        console.log(setErrors)
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
    style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }}
  >
    <div className="relative min-h-screen flex items-center justify-center w-full px-4">
      {/* Fondo difuminado mejorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl"></div>
  
      {/* Card con efecto vidrio mejorado */}
      <div className="relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-10 max-w-2xl w-full border border-white/30">
        <h2 className="text-7xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-md">
          Tus Finanzas
        </h2>
  
        <div className="text-center space-y-2">
          <strong className="text-xl text-gray-800 font-medium">
            Así están tus consumos:
          </strong>
          <span className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold animate-pulse">
            {user?.user}
          </span>
        </div>
      </div>
    </div>
  
    {/* Botones flotantes mejorados */}
    <div className="absolute top-5 right-5 flex gap-4">
      {!user && (
        <button
          className="px-6 py-3 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-xl font-semibold 
                     hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                     active:scale-95 ring-0 hover:ring-4 ring-purple-200/40"
          onClick={() => setShowForm("signup")}
        >
          Regístrate
        </button>
      )}
      <button
        className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300
                  ${
                    user 
                      ? "bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700" 
                      : "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  }
                  hover:scale-105 active:scale-95 relative overflow-hidden
                  ring-0 hover:ring-4 ${user ? "ring-red-200/40" : "ring-cyan-200/40"}`}
        onClick={user ? handleLogout : () => setShowForm("login")}
      >
        <span className="relative z-10">
          {user ? "Cerrar sesión" : "Iniciar sesión"}
        </span>
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
      </button>
    </div>
  
    {/* Formulario mejorado */}
    {(showForm === "signup" || showForm === "login") && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-white/30">
          {showForm === "signup" ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Registro de Usuario
              </h2>
  
              <div className="space-y-6">
                {[
                  {
                    label: "Nombre de Usuario",
                    value: username,
                    setValue: setUsername,
                    error: errors.username,
                    icon: <FiUser/>
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
                    error: errors.password,
                    type: "password",
                  },
                  {
                    label: "Confirmar Contraseña",
                    value: confirmPassword,
                    setValue: setConfirmPassword,
                    error: errors.password_confirmation,
                    type: "password",
                  },
                ].map(({ label, value, setValue, error, type = "text", icon }) => (
                  <div className="space-y-2" key={label}>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="relative">
                      {/* Icono integrado */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        {icon}
                      </div>
                      
                      {/* Input con label integrado */}
                      <input
                        type={type}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all
                                    ${error ? "border-red-500" : "border-gray-300"}
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={label}  // Label como placeholder
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>
     
                ))}
  
                <button
                  onClick={handleRegister}
                  className="w-full py-3.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white 
                           rounded-xl font-semibold hover:scale-[1.02] transition-transform
                           shadow-lg hover:shadow-xl active:scale-95"
                >
                  Registrarse
                </button>
                <button
                  onClick={() => setShowForm(null)}
                  className="w-full py-3 mt-4 bg-gray-100/80 hover:bg-gray-200/60 text-gray-600 
                           rounded-xl font-medium transition-all border border-white/50"
                >
                  Volver
                </button>
              </div>
            </>
          ) : (
            <Login />
          )}
        </div>
      </div>
    )}
  </div>
  )
};

export default Auth;