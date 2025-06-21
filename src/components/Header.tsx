import React from 'react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleRoleChange = (role: 'student' | 'tutor') => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorium</h1>
              <p className="text-sm text-gray-500">Plataforma de Tutorías Académicas</p>
            </div>
          </div>

          {/* Selector de rol (solo visible si está conectado) */}
          {state.wallet.isConnected && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Rol:</span>
                <select
                  value={state.user?.role || 'student'}
                  onChange={(e) => handleRoleChange(e.target.value as 'student' | 'tutor')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="student">Estudiante</option>
                  <option value="tutor">Tutor</option>
                </select>
              </div>
              
              {/* Indicador de estado de conexión */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Conectado</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 