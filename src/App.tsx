import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import WalletSection from './components/WalletSection';
import TokenSection from './components/TokenSection';
import TutorSection from './components/TutorSection';
import TutoringHistory from './components/TutoringHistory';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

// Componente principal que usa el contexto
function AppContent() {
  const { state, loadTutors, loadTutoringHistory } = useApp();

  // Cargar datos iniciales cuando se conecta la wallet
  useEffect(() => {
    if (state.wallet.isConnected) {
      loadTutors();
      loadTutoringHistory();
    }
  }, [state.wallet.isConnected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Sección de Wallet */}
        <WalletSection />
        
        {/* Mostrar contenido solo si está conectado */}
        {state.wallet.isConnected ? (
          <div className="space-y-8">
            {/* Sección de Tokens */}
            <TokenSection />
            
            {/* Sección de Tutores */}
            <TutorSection />
            
            {/* Historial de Tutorías */}
            <TutoringHistory />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Conecta tu wallet para comenzar
            </h2>
            <p className="text-gray-500">
              Necesitas conectar MetaMask para acceder a las funcionalidades de Mentorium
            </p>
          </div>
        )}
      </main>
      
      {/* Loading overlay */}
      {state.loading && <LoadingSpinner />}
      
      {/* Error message */}
      {state.error && <ErrorMessage message={state.error} />}
    </div>
  );
}

// Componente raíz que proporciona el contexto
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; 