import React from 'react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { state } = useApp();

  const getRoleDisplayName = () => {
    switch (state.user?.role) {
      case "docente":
        return "Docente";
      case "admin":
        return "Admin";
      case "student":
      default:
        return "Estudiante";
    }
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
              <p className="text-sm text-gray-500">
                Plataforma de Tutorías Académicas
              </p>
            </div>
          </div>

          {/* Rol y estado de conexión (solo visible si está conectado) */}
          {state.wallet.isConnected && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-gray-700">Rol:</span>
                <span className="text-sm font-semibold text-primary-600">
                  {getRoleDisplayName()}
                </span>
              </div>

              {/* Indicador de estado de conexión */}
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Conectado
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 