import React from 'react'
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const ResgistroFormulario = () => {
  return (
    <div>
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
    </div>
  )
}

export default ResgistroFormulario;
