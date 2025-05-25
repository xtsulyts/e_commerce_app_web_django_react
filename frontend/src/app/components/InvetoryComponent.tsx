import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../contex/UserContex"

const InventoryComponent = ( ) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    stock_quantity: null,
    category: null
  });
  const { token } = useUser();
 
  // Función para cargar los datos del inventario
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          ...(filters.stock_quantity && { stock_quantity: filters.stock_quantity }),
          ...(filters.category && { 'variant__product__category': filters.category })
        }
      };

      const response = await axios.get('http://127.0.0.1:8000/api/inventory/', config);
      
      setInventoryData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar el inventario');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto que se ejecuta cuando cambia el access_token o los filtros
  useEffect(() => {
    if (token) {
      fetchInventoryData();
    }
  }, [token, filters]);

  // Función para obtener items con bajo stock
  const fetchLowStock = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(
        'http://127.0.0.1:8000/api/inventory/low_stock/', 
        config
      );
      
      setInventoryData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar bajo stock');
      console.error('Error fetching low stock:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Inventario</h2>
      
      {/* Filtros */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Cantidad de Stock:
          <input 
            type="number" 
            onChange={(e) => setFilters({...filters, stock_quantity: e.target.value})}
          />
        </label>
        
        <label style={{ marginLeft: '10px' }}>
          Categoría:
          <input 
            type="text" 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          />
        </label>
        
        <button 
          onClick={fetchLowStock}
          style={{ marginLeft: '10px' }}
        >
          Mostrar Bajo Stock
        </button>
      </div>
      
      {/* Estado de carga */}
      {loading && <p>Cargando inventario...</p>}
      
      {/* Mensaje de error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Tabla de inventario */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Variante</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Umbral Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.id}>
                <td>{item.variant.product.name}</td>
                <td>{item.variant.name}</td>
                <td>{item.variant.product.category}</td>
                <td style={{ 
                  color: item.stock_quantity <= item.low_stock_threshold 
                    ? 'red' 
                    : 'inherit'
                }}>
                  {item.stock_quantity}
                </td>
                <td>{item.low_stock_threshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryComponent;