import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tutor } from '../types';
import RequestTutoringModal from './RequestTutoringModal';

const TutorSection: React.FC = () => {
  const { state, requestTutoring } = useApp();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleRequestTutoring = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowModal(true);
  };

  const handleSubmitTutoring = async (subject: string, duration: number) => {
    if (!selectedTutor || !state.wallet.address) return;

    const tokensPaid = selectedTutor.hourlyRate * duration;
    
    await requestTutoring(selectedTutor.wallet, tokensPaid);

    setShowModal(false);
    setSelectedTutor(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tutores Disponibles
        </h2>
        
        {state.tutors.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500">No hay tutores disponibles</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.tutors.map((tutor) => (
              <div
                key={tutor.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  tutor.isAvailable
                    ? 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {formatAddress(tutor.wallet)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{tutor.rating}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Materias:</p>
                  <div className="flex flex-wrap gap-1">
                    {tutor.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Tarifa por hora:</p>
                    <p className="font-semibold text-primary-600">{tutor.hourlyRate} MTM</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tutor.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {tutor.isAvailable ? 'Disponible' : 'No disponible'}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestTutoring(tutor)}
                  disabled={!tutor.isAvailable || state.loading}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    tutor.isAvailable
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {state.loading ? 'Procesando...' : 'Solicitar Tutoría'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para solicitar tutoría */}
      {showModal && selectedTutor && (
        <RequestTutoringModal
          tutor={selectedTutor}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitTutoring}
          loading={state.loading}
        />
      )}
    </>
  );
};

export default TutorSection; 