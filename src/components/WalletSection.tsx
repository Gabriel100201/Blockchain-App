import React from 'react';
import { useApp } from '../context/AppContext';

const WalletSection: React.FC = () => {
  const { state, connectWallet } = useApp();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Conectar Wallet
      </h2>

      {!state.wallet.isConnected ? (
        <div className="text-center">
          <button
            onClick={connectWallet}
            disabled={state.loading}
            className="btn-primary flex items-center justify-center space-x-2 mx-auto"
          >
            {state.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Conectar MetaMask</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Conecta tu wallet de MetaMask para acceder a Mentorium
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Wallet Conectada
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  {formatAddress(state.wallet.address!)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {state.wallet.balance} MTM
              </p>
              <p className="text-xs text-gray-500">Tokens disponibles</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rol actual:</span>
              <span className="font-medium text-gray-900 capitalize">
                {state.user?.role || "estudiante"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contrato:</span>
              <span className="font-mono text-gray-900 text-xs">
                {formatAddress("0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD")}
              </span>
            </div>
          </div>

          {/* Información adicional según el rol */}
          {state.user?.role === "docente" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Rol de Docente:</strong> Puedes asignar tokens a
                estudiantes para que participen en el intercambio de
                conocimiento.
              </p>
            </div>
          )}

          {state.user?.role === "admin" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <strong>Rol de Admin:</strong> Control total del sistema. Puedes
                gestionar roles y asignar tokens.
              </p>
            </div>
          )}

          {state.user?.role === "student" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Rol de Estudiante:</strong> Puedes crear ofertas de
                tutoría y solicitar tutorías de otros estudiantes.
                <strong>¡Intercambio bidireccional de conocimiento!</strong>
              </p>
            </div>
          )}

          {/* Información general del sistema */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Sistema de Intercambio:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • <strong>Crear ofertas:</strong> Ofrece tutorías en materias
                que dominas
              </li>
              <li>
                • <strong>Solicitar tutorías:</strong> Aprende de otros
                estudiantes
              </li>
              <li>
                • <strong>Ganar tokens:</strong> Recibe pagos por tus tutorías
              </li>
              <li>
                • <strong>Canjear beneficios:</strong> Usa tus tokens para
                obtener recompensas
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSection; 