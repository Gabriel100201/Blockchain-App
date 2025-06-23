import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { blockchainService, ContractRole } from "../services/blockchainService";

interface DebugInfo {
  contractRole?: ContractRole;
  contractBalance?: number;
  ofertasCount?: number;
  tutoriasCount?: number;
  timestamp?: string;
  network?: string;
  chainId?: string;
  error?: string;
}

const DebugPanel: React.FC = () => {
  const { state } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [isLoading, setIsLoading] = useState(false);

  const roleNames: { [key in ContractRole]: string } = {
    [ContractRole.None]: "Sin Rol",
    [ContractRole.Estudiante]: "Estudiante",
    [ContractRole.Docente]: "Docente",
    [ContractRole.Admin]: "Admin",
  };

  const fetchDebugInfo = async () => {
    if (!state.wallet?.address) return;

    setIsLoading(true);
    try {
      // Obtener información adicional del contrato
      const contractRole = await blockchainService.getRole(
        state.wallet.address
      );
      const contractBalance = await blockchainService.getTokenBalance(
        state.wallet.address
      );
      const ofertas = await blockchainService.getOfertasActivas();
      const tutorias = await blockchainService.getTutorias();

      setDebugInfo({
        contractRole,
        contractBalance,
        ofertasCount: ofertas.length,
        tutoriasCount: tutorias.length,
        timestamp: new Date().toLocaleString(),
        network: window.ethereum?.networkVersion || "Desconocida",
        chainId: window.ethereum?.chainId || "Desconocido",
      });
    } catch (error) {
      console.error("Error obteniendo debug info:", error);
      setDebugInfo({
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toLocaleString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && state.wallet?.address) {
      fetchDebugInfo();
    }
  }, [isVisible, state.wallet?.address]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const refreshData = () => {
    fetchDebugInfo();
  };

  if (!state.wallet?.address) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante */}
      <button
        onClick={toggleVisibility}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
        title="Panel de Debug"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Panel de debug */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              🔧 Panel de Debug
            </h3>
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                title="Actualizar datos"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={toggleVisibility}
                className="text-gray-500 hover:text-gray-700"
                title="Cerrar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Cargando datos...</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3 text-sm">
              {/* Información básica */}
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  👤 Información Básica
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-mono text-xs text-gray-800">
                      {state.wallet.address.slice(0, 6)}...
                      {state.wallet.address.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conectado:</span>
                    <span
                      className={`font-semibold ${
                        state.wallet.address ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {state.wallet.address ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estado del contexto */}
              <div className="bg-blue-50 rounded p-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  📊 Estado del Contexto
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance (Contexto):</span>
                    <span className="font-semibold text-blue-600">
                      {state.wallet.balance} MTM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rol (Contexto):</span>
                    <span className="font-semibold text-blue-600 capitalize">
                      {state.user?.role ?? "No definido"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuario:</span>
                    <span className="font-semibold text-blue-600">
                      {state.user
                        ? `${state.user.name || ""} (${state.user.role})`
                        : "No definido"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estado del contrato */}
              <div className="bg-green-50 rounded p-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  🏗️ Estado del Contrato
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance (Contrato):</span>
                    <span className="font-semibold text-green-600">
                      {debugInfo.contractBalance !== undefined
                        ? `${debugInfo.contractBalance} MTM`
                        : "Cargando..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rol (Contrato):</span>
                    <span className="font-semibold text-green-600">
                      {debugInfo.contractRole !== undefined
                        ? roleNames[debugInfo.contractRole]
                        : "Cargando..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ofertas Activas:</span>
                    <span className="font-semibold text-green-600">
                      {debugInfo.ofertasCount !== undefined
                        ? debugInfo.ofertasCount
                        : "Cargando..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tutorías Totales:</span>
                    <span className="font-semibold text-green-600">
                      {debugInfo.tutoriasCount !== undefined
                        ? debugInfo.tutoriasCount
                        : "Cargando..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de red */}
              <div className="bg-purple-50 rounded p-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  🌐 Información de Red
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Red:</span>
                    <span className="font-semibold text-purple-600">
                      {debugInfo.network}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chain ID:</span>
                    <span className="font-semibold text-purple-600">
                      {debugInfo.chainId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contrato:</span>
                    <span className="font-mono text-xs text-purple-600">
                      0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD
                    </span>
                  </div>
                </div>
              </div>

              {/* Errores */}
              {debugInfo.error && (
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-700 mb-2">❌ Error</h4>
                  <p className="text-red-600 text-xs">{debugInfo.error}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-center text-xs text-gray-500 pt-2 border-t">
                Última actualización: {debugInfo.timestamp || "Nunca"}
              </div>

              {/* Acciones rápidas */}
              <div className="bg-yellow-50 rounded p-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  ⚡ Acciones Rápidas
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      console.log("=== DEBUG INFO ===");
                      console.log("Wallet Connection:", state.wallet);
                      console.log("User:", state.user);
                      console.log("Role:", state.user?.role);
                      console.log("Balance:", state.wallet.balance);
                      console.log("Debug Info:", debugInfo);
                      console.log("==================");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Log a Consola
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(
                          {
                            wallet: state.wallet,
                            user: state.user,
                            role: state.user?.role,
                            balance: state.wallet.balance,
                            debugInfo,
                          },
                          null,
                          2
                        )
                      );
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Copiar JSON
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await blockchainService.getRole(state.wallet.address!);
                        console.log("🔄 Rol recargado desde el contrato");
                      } catch (error) {
                        console.error("❌ Error recargando rol:", error);
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Recargar Rol
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
