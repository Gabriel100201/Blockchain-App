import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TokenSection: React.FC = () => {
  const { state, assignTokens } = useApp();
  const [amount, setAmount] = useState(10);

  const handleAssignTokens = async () => {
    if (amount > 0 && state.wallet.address) {
      await assignTokens(state.wallet.address, amount);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Gestión de Tokens
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Saldo actual */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Actual</p>
              <p className="text-2xl font-bold text-primary-600">
                {state.wallet.balance} MTM
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tokens disponibles para solicitar tutorías
          </p>
        </div>

        {/* Asignar tokens */}
        <div className="space-y-4">
          <div>
            <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad de tokens a asignar
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                id="tokenAmount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                max="100"
                className="input-field flex-1"
                placeholder="10"
              />
              <button
                onClick={handleAssignTokens}
                disabled={state.loading || amount <= 0}
                className="btn-primary whitespace-nowrap"
              >
                {state.loading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>💡 <strong>Consejo:</strong> Asigna tokens para poder solicitar tutorías</p>
            <p>💰 Cada tutoría cuesta entre 10-20 tokens dependiendo del tutor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSection; 