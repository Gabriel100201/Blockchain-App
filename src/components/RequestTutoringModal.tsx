import React, { useState } from 'react';
import { Tutor } from '../types';

interface RequestTutoringModalProps {
  tutor: Tutor;
  onClose: () => void;
  onSubmit: (subject: string, duration: number) => Promise<void>;
  loading: boolean;
}

const RequestTutoringModal: React.FC<RequestTutoringModalProps> = ({
  tutor,
  onClose,
  onSubmit,
  loading
}) => {
  const [subject, setSubject] = useState(tutor.subjects[0] || '');
  const [duration, setDuration] = useState(1);
  const [customSubject, setCustomSubject] = useState('');

  const totalCost = tutor.hourlyRate * duration;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = subject === 'custom' ? customSubject : subject;
    if (finalSubject.trim()) {
      await onSubmit(finalSubject, duration);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Solicitar Tutoría
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Tutor seleccionado:</p>
          <p className="font-medium text-gray-900">{tutor.name}</p>
          <p className="text-sm text-gray-500">{tutor.hourlyRate} MTM por hora</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Materia
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              {tutor.subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
              <option value="custom">Otra materia</option>
            </select>
          </div>

          {subject === 'custom' && (
            <div>
              <label htmlFor="customSubject" className="block text-sm font-medium text-gray-700 mb-2">
                Especificar materia
              </label>
              <input
                type="text"
                id="customSubject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="input-field"
                placeholder="Ej: Cálculo Diferencial"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duración (horas)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="0.5"
              max="8"
              step="0.5"
              className="input-field"
              disabled={loading}
            />
          </div>

          <div className="p-3 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Costo total:</span>
              <span className="text-lg font-bold text-primary-600">
                {totalCost} MTM
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {duration} hora{duration !== 1 ? 's' : ''} × {tutor.hourlyRate} MTM/hora
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !subject || (subject === 'custom' && !customSubject.trim())}
              className="btn-primary flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                'Confirmar Tutoría'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestTutoringModal; 