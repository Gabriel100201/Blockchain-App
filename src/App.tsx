import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import WalletSection from "./components/WalletSection";
import TokenSection from "./components/TokenSection";
import RoleDisplay from "./components/RoleDisplay";
import OfertasTutoriaSection from "./components/OfertasTutoriaSection";
import MisOfertasSection from "./components/MisOfertasSection";
import TutoringHistory from "./components/TutoringHistory";
import DocenteDashboard from "./components/DocenteDashboard";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import DebugPanel from "./components/DebugPanel";

function AppContent() {
  const { state } = useApp();
  const isDocenteOrAdmin =
    state.user?.role === "docente" || state.user?.role === "admin";
  const isStudent = state.user?.role === "student";

  const renderStudentView = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <OfertasTutoriaSection />
        </div>
        <div className="space-y-6">
          <MisOfertasSection />
        </div>
      </div>
      <div className="mt-8">
        <TutoringHistory />
      </div>
    </>
  );

  const renderDocenteView = () => (
    <>
      <div className="mt-8">
        <DocenteDashboard />
      </div>
      <div className="mt-8">
        <TutoringHistory />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Secciones comunes para todos los roles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <WalletSection />
          </div>
          <div className="space-y-6">
            <TokenSection />
            <RoleDisplay />
          </div>
        </div>

        {/* Vistas condicionales por rol */}
        {state.wallet.isConnected ? (
          <>
            {isStudent && renderStudentView()}
            {isDocenteOrAdmin && renderDocenteView()}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Conecta tu wallet para comenzar
            </h2>
            <p className="text-gray-500">
              Necesitas conectar MetaMask para acceder a las funcionalidades de
              Mentorium.
            </p>
          </div>
        )}
      </main>

      {/* Componentes de estado */}
      <ErrorMessage />
      <LoadingSpinner />

      {/* Panel de Debug */}
      <DebugPanel />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
