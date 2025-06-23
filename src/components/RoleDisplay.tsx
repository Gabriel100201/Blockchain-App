import React from "react";
import { useApp } from "../context/AppContext";

const RoleDisplay: React.FC = () => {
  const { state, forceReloadRole } = useApp();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600 bg-red-100";
      case "docente":
        return "text-blue-600 bg-blue-100";
      case "student":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "👑";
      case "docente":
        return "👨‍🏫";
      case "student":
        return "👨‍🎓";
      default:
        return "❓";
    }
  };

  if (!state.wallet.isConnected) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {getRoleIcon(state.user?.role || "unknown")}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tu Rol</h3>
            <p
              className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(
                state.user?.role || "unknown"
              )}`}
            >
              {state.user?.role || "Sin rol"}
            </p>
          </div>
        </div>

        <button
          onClick={forceReloadRole}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          title="Recargar rol desde el contrato"
        >
          🔄 Recargar
        </button>
      </div>

      {state.user?.role === "student" && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Si puedes asignar tokens a otros estudiantes,
            tu rol debería ser "docente". Haz clic en "Recargar" para
            sincronizar con el contrato.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleDisplay;
