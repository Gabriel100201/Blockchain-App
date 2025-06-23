import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { OfertaTutoria } from "../types";

const OfertasTutoriaSection: React.FC = () => {
  const { state, requestTutoring } = useApp();
  const [selectedOferta, setSelectedOferta] = useState<OfertaTutoria | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleRequestTutoring = (oferta: OfertaTutoria) => {
    setSelectedOferta(oferta);
    setShowModal(true);
  };

  const handleConfirmTutoring = async () => {
    if (!selectedOferta) return;

    try {
      await requestTutoring(selectedOferta.id!);
      setShowModal(false);
      setSelectedOferta(null);
    } catch (error) {
      console.error("Error al solicitar tutoría:", error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isMyOferta = (oferta: OfertaTutoria) => {
    return oferta.tutor.toLowerCase() === state.wallet.address?.toLowerCase();
  };

  return (
    <>
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ofertas de Tutoría Disponibles
        </h2>

        {state.ofertasTutoria.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              No hay ofertas de tutoría disponibles
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Los estudiantes pueden crear ofertas para compartir su
              conocimiento
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.ofertasTutoria.map((oferta) => (
              <div
                key={oferta.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  oferta.activa
                    ? "border-gray-200 hover:border-primary-300 hover:shadow-md"
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
                      isMyOferta(oferta)
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isMyOferta(oferta) ? "Mi oferta" : "Disponible"}
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

                {!isMyOferta(oferta) && (
                  <button
                    onClick={() => handleRequestTutoring(oferta)}
                    disabled={!oferta.activa || state.loading}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      oferta.activa
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {state.loading ? "Procesando..." : "Solicitar Tutoría"}
                  </button>
                )}

                {isMyOferta(oferta) && (
                  <div className="text-center text-sm text-gray-500">
                    Esta es tu oferta
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && selectedOferta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Solicitud de Tutoría
            </h3>

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Materia:
                </span>
                <p className="text-gray-900">{selectedOferta.materia}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">
                  Tutor:
                </span>
                <p className="text-gray-900 font-mono">
                  {formatAddress(selectedOferta.tutor)}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">
                  Precio:
                </span>
                <p className="text-gray-900">{selectedOferta.precio} MTM</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">
                  Tu saldo:
                </span>
                <p
                  className={`${
                    state.wallet.balance >= selectedOferta.precio
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {state.wallet.balance} MTM
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmTutoring}
                disabled={
                  state.wallet.balance < selectedOferta.precio || state.loading
                }
                className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors ${
                  state.wallet.balance >= selectedOferta.precio &&
                  !state.loading
                    ? "bg-primary-600 hover:bg-primary-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {state.loading ? "Procesando..." : "Confirmar"}
              </button>
            </div>

            {state.wallet.balance < selectedOferta.precio && (
              <p className="text-red-600 text-sm mt-3 text-center">
                Saldo insuficiente. Necesitas{" "}
                {selectedOferta.precio - state.wallet.balance} MTM más.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OfertasTutoriaSection;
