"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex"
//import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const { loginUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(null);

    try {
      await loginUser(email, password);
      router.push("./usuario");
    } catch (err: any) {
      setError(err.message);
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
{/* 
      <GoogleOAuthProvider clientId="243480656213-08rdonp2jjmc5ocv8i9uh84vuthui9up.apps.googleusercontent.com">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            // onError={() => {
            //   setError('Falló el inicio de sesión con Google');
            // }}
            size="large"
            text="continue_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
      </GoogleOAuthProvider> */}
    </div>
  );
}

export default Login;
























