import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const MisOfertasSection: React.FC = () => {
  const { state, crearOfertaTutoria, cancelarOfertaTutoria } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [materia, setMateria] = useState("");
  const [precio, setPrecio] = useState("");

  const misOfertas = state.ofertasTutoria.filter(
    (oferta) =>
      oferta.tutor.toLowerCase() === state.wallet.address?.toLowerCase()
  );

  const handleCreateOferta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia.trim() || !precio.trim()) return;

    try {
      await crearOfertaTutoria(materia, parseInt(precio));
      setMateria("");
      setPrecio("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error al crear oferta:", error);
    }
  };

  const handleCancelOferta = async (ofertaId: number) => {
    if (confirm("¿Estás seguro de que quieres cancelar esta oferta?")) {
      try {
        await cancelarOfertaTutoria(ofertaId);
      } catch (error) {
        console.error("Error al cancelar oferta:", error);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Ofertas de Tutoría
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Crear Nueva Oferta
          </button>
        </div>

        {misOfertas.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">
              No tienes ofertas de tutoría creadas
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Crea una oferta para compartir tu conocimiento y ganar tokens
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misOfertas.map((oferta) => (
              <div
                key={oferta.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  oferta.activa
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {oferta.materia}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {formatAddress(oferta.tutor)}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      oferta.activa
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {oferta.activa ? "Activa" : "Cancelada"}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Precio por sesión:</p>
                  <p className="font-semibold text-primary-600">
                    {oferta.precio} MTM
                  </p>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Creada:{" "}
                  {new Date(oferta.timestamp * 1000).toLocaleDateString()}
                </div>

                {oferta.activa && (
                  <button
                    onClick={() => handleCancelOferta(oferta.id!)}
                    disabled={state.loading}
                    className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    {state.loading ? "Procesando..." : "Cancelar Oferta"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear oferta */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Crear Nueva Oferta de Tutoría
            </h3>

            <form onSubmit={handleCreateOferta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materia o Tema
                </label>
                <input
                  type="text"
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  placeholder="Ej: Matemáticas, Programación, Inglés..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio por Sesión (MTM)
                </label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="50"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">Consejos:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Sé específico con la materia o tema</li>
                  <li>• Establece un precio justo y competitivo</li>
                  <li>• Puedes cancelar la oferta en cualquier momento</li>
                  <li>
                    • Los tokens se transfieren automáticamente al completar la
                    tutoría
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={state.loading}
                  className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors ${
                    !state.loading
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {state.loading ? "Creando..." : "Crear Oferta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MisOfertasSection;
