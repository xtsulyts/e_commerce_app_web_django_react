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

// Definir la estructura del contexto
interface UserContextType { 
  user: User | null;
  access_token: string | null;
  totalIngresos: number;
  totalGastos: number;
  saldoTotal: number;
  isLoggedIn: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  fetchTotales: () => Promise<void>; // Nueva función para obtener los totales
}

// Crear el contexto con un valor inicial vacío
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [totalIngresos, setTotalIngresos] = useState<number>(0); // Estado para total de ingresos
  const [totalGastos, setTotalGastos] = useState<number>(0); // Estado para total de gastos
  const [saldoTotal, setSaldoTotal] = useState<number>(0); // Estado para saldo total


  // Función para manejar el login
  const loginUser = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch("http://localhost:8000/login_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }
      
      const { access_token, message, refresh_token } = await loginResponse.json();
      setAccessToken(access_token);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("messege", message);
      localStorage.setItem("refresh_token", refresh_token);

      // Obtener perfil de usuario
      const profileResponse = await fetch("http://localhost:8000/user_profile/", {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

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

     
    } catch (error) {
      console.error(error);
      throw error;
    }

   
      setIsLoggedIn(true);
      console.log("Usuario logueado");
    
  };

  // Función para obtener los totales desde el backend
  const fetchTotales = async () => {
    try {
      if (!access_token) {
        throw new Error("No hay token de acceso. Por favor, inicia sesión.");
      }

      const response = await fetch("http://127.0.0.1:8000/totales_usuario/", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      

      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          throw new Error("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
        } else {
          throw new Error("Error al obtener los totales.");
        }
        
      }
      console.log("Login exitoso:", user);

      const data = await response.json();
      setTotalIngresos(data.total_ingresos);
      setTotalGastos(data.total_gastos);
      setSaldoTotal(data.saldo_total);
    } catch (error) {
      console.error("Error fetching totales:", error);
      throw error;
    }
    
  };

    // Cargar el usuario desde el localStorage al iniciar la aplicación
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("access_token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    }, []);
  
    // Llamar a fetchTotales cuando access_token cambia
    useEffect(() => {
      if (access_token) {
        fetchTotales();
      }
    }, [access_token]);
  

  // Función para cerrar sesión
  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    setTotalIngresos(0);
    setTotalGastos(0);
    setSaldoTotal(0);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("messege")
    setIsLoggedIn(false);
    console.log("Usuario cerró sesión");
  };


  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        access_token,
        totalIngresos,
        totalGastos,
        saldoTotal,
        loginUser,
        logoutUser,
        fetchTotales,
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