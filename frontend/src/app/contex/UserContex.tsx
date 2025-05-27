"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";


// Definir la estructura de los datos del usuario
interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  avatar?: string; // Agregar campo avatar
}
interface carritoProp {
  carrito: [];
 }
// Definir la estructura del contexto
interface UserContextType { 
  user: User | null;
  token: string | null;
  carrito: carritoProp | [];
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  
}

// Crear el contexto con un valor inicial vacío
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setAccessToken] = useState<string | null>(null);
  const [carrito, setCarrito] = useState<carritoProp | []>([]);
  // Función para manejar el login
  const loginUser = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }
      
      const { token } = await loginResponse.json();
      setAccessToken(token);
      localStorage.setItem("token", token);
      console.log(loginResponse)
      // localStorage.setItem("messege", message);
      // localStorage.setItem("refresh_token", refresh_token);

      // Obtener perfil de usuario
      const profileResponse = await fetch("http://localhost:8000/profile/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        
      });
      console.log('token',{token})
    

      if (!profileResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }
     
      const userData = await profileResponse.json();
      const avatar = userData.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${userData.user}`;
      const userWithAvatar = { ...userData, avatar };

      setUser(userWithAvatar);
      localStorage.setItem("user", JSON.stringify(userWithAvatar));

      // Redirigir al usuario a la página de inicio
      //window.location.href = "/home";
      console.log('token',{token})
    
     
    } catch (error) {
      console.error(error);
      throw error;
    }
    

   
      setIsLoggedIn(true);
      console.log("Usuario logueado");
      console.log(isLoggedIn)
    
  };
  




    // Cargar el usuario desde el localStorage al iniciar la aplicación
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    }, []);
  


  // Función para cerrar sesión
  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    //localStorage.removeItem("messege")
    setIsLoggedIn(false);
    console.log("Usuario cerró sesión");
  };


  return (
    <UserContext.Provider
      value={{
        user,
        token,
        carrito,
        loginUser,
        logoutUser,
       
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};