import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const DocenteDashboard: React.FC = () => {
  const { state, assignTokens, setRole } = useApp();
  const [studentAddress, setStudentAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [roleAddress, setRoleAddress] = useState("");
  const [roleIndex, setRoleIndex] = useState("3"); // Por defecto Tutor

  const handleAssignTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddress || !tokenAmount) return;

    try {
      await assignTokens(studentAddress, parseInt(tokenAmount));
      setStudentAddress("");
      setTokenAmount("");
    } catch (error) {
      console.error("Error al asignar tokens:", error);
    }
  };

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAddress || !roleIndex) return;

    try {
      await setRole(roleAddress, parseInt(roleIndex));
      setRoleAddress("");
      setRoleIndex("3");
    } catch (error) {
      console.error("Error al establecer rol:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Panel de Docente
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sección de Asignación de Tokens */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            Asignar Tokens a Estudiantes
          </h3>

          <form onSubmit={handleAssignTokens} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección del Estudiante
              </label>
              <input
                type="text"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Tokens
              </label>
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Asignar Tokens
            </button>
          </form>
        </div>

        {/* Sección de Gestión de Roles */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-4">
            Gestionar Roles de Usuarios
          </h3>

          <form onSubmit={handleSetRole} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección del Usuario
              </label>
              <input
                type="text"
                value={roleAddress}
                onChange={(e) => setRoleAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol a Asignar
              </label>
              <select
                value={roleIndex}
                onChange={(e) => setRoleIndex(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="1">Docente</option>
                <option value="2">Estudiante con Dificultad</option>
                <option value="3">Tutor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Establecer Rol
            </button>
          </form>
        </div>
      </div>

      {/* Información del Docente */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Información del Docente
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Dirección:</span>
            <p className="text-gray-800 font-mono">{state.wallet.address}</p>
          </div>

          <div>
            <span className="font-medium text-gray-600">Rol:</span>
            <p className="text-gray-800 capitalize">{state.user?.role}</p>
          </div>

          <div>
            <span className="font-medium text-gray-600">Saldo de Tokens:</span>
            <p className="text-gray-800">{state.wallet.balance} tokens</p>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Instrucciones:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>
            • <strong>Asignar Tokens:</strong> Puedes asignar tokens a cualquier
            estudiante ingresando su dirección de wallet.
          </li>
          <li>
            • <strong>Gestionar Roles:</strong> Puedes cambiar el rol de
            cualquier usuario (solo si eres el owner del contrato).
          </li>
          <li>
            • <strong>Roles disponibles:</strong> Docente (1), Estudiante con
            Dificultad (2), Tutor (3)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocenteDashboard;
