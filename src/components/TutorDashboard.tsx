import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const TutorDashboard: React.FC = () => {
  const { state, updateSessionStatus } = useApp();
  const [isAvailable, setIsAvailable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [subjects, setSubjects] = useState(["Matemáticas", "Física"]);

  const pendingSessions = state.tutoringHistory.filter(
    (session) =>
      session.tutorAddress.toLowerCase() ===
        state.wallet.address?.toLowerCase() && session.status === "pending"
  );

  const completedSessions = state.tutoringHistory.filter(
    (session) =>
      session.tutorAddress.toLowerCase() ===
        state.wallet.address?.toLowerCase() && session.status === "completed"
  );

  const totalEarnings = completedSessions.reduce(
    (sum, session) => sum + session.tokensPaid,
    0
  );

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  const handleUpdateRate = () => {
    // Aquí se conectaría con el smart contract para actualizar la tarifa
    console.log("Actualizando tarifa a:", hourlyRate);
  };

  const handleAcceptSession = async (sessionId: string) => {
    await updateSessionStatus(sessionId, "completed");
  };

  const handleRejectSession = async (sessionId: string) => {
    await updateSessionStatus(sessionId, "cancelled");
  };

  return (
    <div className="space-y-8">
      {/* Panel de Control del Tutor */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Panel de Control - Tutor
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Estado de Disponibilidad */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Estado</h3>
              <div
                className={`w-3 h-3 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {isAvailable ? "Disponible para tutorías" : "No disponible"}
            </p>
            <button
              onClick={handleToggleAvailability}
              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                isAvailable
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isAvailable
                ? "Marcar como No Disponible"
                : "Marcar como Disponible"}
            </button>
          </div>

          {/* Tarifa por Hora */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-gray-900 mb-3">Tarifa por Hora</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                min="1"
                max="100"
              />
              <span className="text-sm text-gray-600">MTM</span>
            </div>
            <button
              onClick={handleUpdateRate}
              className="w-full py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Actualizar Tarifa
            </button>
          </div>

          {/* Ganancias Totales */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-gray-900 mb-3">
              Ganancias Totales
            </h3>
            <p className="text-2xl font-bold text-yellow-600 mb-2">
              {totalEarnings} MTM
            </p>
            <p className="text-sm text-gray-600">
              {completedSessions.length} sesiones completadas
            </p>
          </div>
        </div>
      </div>

      {/* Sesiones Pendientes */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sesiones Pendientes ({pendingSessions.length})
        </h2>

        {pendingSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-500">No hay sesiones pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSessions.map((session) => (
              <div
                key={session.id}
                className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {session.subject}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Estudiante: {session.studentAddress.slice(0, 6)}...
                      {session.studentAddress.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duración: {session.duration} hora
                      {session.duration !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-600">
                      {session.tokensPaid} MTM
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleAcceptSession(session.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleRejectSession(session.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Sesiones */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Historial de Sesiones
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.tutoringHistory
                .filter(
                  (session) =>
                    session.tutorAddress.toLowerCase() ===
                    state.wallet.address?.toLowerCase()
                )
                .map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {session.studentAddress.slice(0, 6)}...
                        {session.studentAddress.slice(-4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {session.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(session.date).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.duration} hora{session.duration !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium text-primary-600">
                        {session.tokensPaid} MTM
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : session.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {session.status === "completed"
                          ? "Completada"
                          : session.status === "pending"
                          ? "Pendiente"
                          : "Cancelada"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
