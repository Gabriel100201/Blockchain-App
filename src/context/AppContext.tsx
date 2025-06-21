import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WalletConnection, User, Tutor, TutoringSession } from '../types';
import { mockBackend } from '../services/mockBackend';

// Estado inicial de la aplicación
interface AppState {
  wallet: WalletConnection;
  user: User | null;
  tutors: Tutor[];
  tutoringHistory: TutoringSession[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  wallet: {
    isConnected: false,
    address: null,
    balance: 0
  },
  user: null,
  tutors: [],
  tutoringHistory: [],
  loading: false,
  error: null
};

// Acciones disponibles
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CONNECT_WALLET"; payload: WalletConnection }
  | { type: "SET_USER_ROLE"; payload: "student" | "tutor" }
  | { type: "SET_TUTORS"; payload: Tutor[] }
  | { type: "SET_TUTORING_HISTORY"; payload: TutoringSession[] }
  | { type: "UPDATE_BALANCE"; payload: number }
  | { type: "ADD_TUTORING_SESSION"; payload: TutoringSession }
  | {
      type: "UPDATE_SESSION_STATUS";
      payload: {
        sessionId: string;
        status: "pending" | "completed" | "cancelled";
      };
    };

// Reducer para manejar el estado
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "CONNECT_WALLET":
      return {
        ...state,
        wallet: action.payload,
        user: action.payload.isConnected
          ? {
              address: action.payload.address!,
              role: "student", // Por defecto es estudiante
            }
          : null,
      };

    case "SET_USER_ROLE":
      return {
        ...state,
        user: state.user ? { ...state.user, role: action.payload } : null,
      };

    case "SET_TUTORS":
      return { ...state, tutors: action.payload };

    case "SET_TUTORING_HISTORY":
      return { ...state, tutoringHistory: action.payload };

    case "UPDATE_BALANCE":
      return {
        ...state,
        wallet: { ...state.wallet, balance: action.payload },
      };

    case "ADD_TUTORING_SESSION":
      return {
        ...state,
        tutoringHistory: [action.payload, ...state.tutoringHistory],
      };

    case "UPDATE_SESSION_STATUS":
      return {
        ...state,
        tutoringHistory: state.tutoringHistory.map((session) =>
          session.id === action.payload.sessionId
            ? { ...session, status: action.payload.status }
            : session
        ),
      };

    default:
      return state;
  }
}

// Contexto
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Funciones de conveniencia
  connectWallet: () => Promise<void>;
  assignTokens: (amount: number) => Promise<void>;
  loadTutors: () => Promise<void>;
  loadTutoringHistory: () => Promise<void>;
  requestTutoring: (
    session: Omit<TutoringSession, "id" | "status">
  ) => Promise<void>;
  updateSessionStatus: (
    sessionId: string,
    status: "pending" | "completed" | "cancelled"
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contexto
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Función para conectar wallet
  const connectWallet = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const walletConnection = await mockBackend.connectWallet();
      dispatch({ type: "CONNECT_WALLET", payload: walletConnection });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al conectar wallet",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para asignar tokens
  const assignTokens = async (amount: number) => {
    if (!state.wallet.address) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const newBalance = await mockBackend.assignTokens(
        state.wallet.address,
        amount
      );
      dispatch({ type: "UPDATE_BALANCE", payload: newBalance });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al asignar tokens",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para cargar tutores
  const loadTutors = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const tutors = await mockBackend.getTutors();
      dispatch({ type: "SET_TUTORS", payload: tutors });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al cargar tutores",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para cargar historial de tutorías
  const loadTutoringHistory = async () => {
    if (!state.wallet.address) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const history = await mockBackend.getTutoringHistory(
        state.wallet.address
      );
      dispatch({ type: "SET_TUTORING_HISTORY", payload: history });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al cargar historial",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para solicitar tutoría
  const requestTutoring = async (
    session: Omit<TutoringSession, "id" | "status">
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const newSession = await mockBackend.requestTutoring(session);
      dispatch({ type: "ADD_TUTORING_SESSION", payload: newSession });

      // Actualizar balance
      const newBalance = await mockBackend.getBalance(state.wallet.address!);
      dispatch({ type: "UPDATE_BALANCE", payload: newBalance });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al solicitar tutoría",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para actualizar el estado de una sesión de tutoría
  const updateSessionStatus = async (
    sessionId: string,
    status: "pending" | "completed" | "cancelled"
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await mockBackend.updateSessionStatus(sessionId, status);
      dispatch({
        type: "UPDATE_SESSION_STATUS",
        payload: { sessionId, status },
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al actualizar estado de la sesión",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    connectWallet,
    assignTokens,
    loadTutors,
    loadTutoringHistory,
    requestTutoring,
    updateSessionStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook para usar el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
} 