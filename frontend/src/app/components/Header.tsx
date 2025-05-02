import React from 'react'
import "./estilos/header.css"
const Header = () => {
  return (
    <div className='headerContainer'>
        <div className='headerLogo'>
            <img
                />
        </div> 
        <div className='headerNombre'>
            <h1 className=''>NOMBRE DE LA APP</h1>
        </div>
        <div className='headerBotones'>
            <button>iniciar sesion</button>    
        </div>   
    </div>
  )
};

export default Header;
