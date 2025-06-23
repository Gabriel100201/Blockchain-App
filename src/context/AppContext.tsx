import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { WalletConnection, User, Tutor, TutoringSession } from "../types";
import { blockchainService, ContractRole } from "../services/blockchainService";

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
    balance: 0,
  },
  user: null,
  tutors: [],
  tutoringHistory: [],
  loading: false,
  error: null,
};

// Acciones disponibles
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CONNECT_WALLET"; payload: WalletConnection }
  | { type: "SET_USER_ROLE"; payload: "student" | "tutor" | "docente" }
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
  assignTokens: (to: string, amount: number) => Promise<void>;
  loadTutors: () => Promise<void>;
  loadTutoringHistory: () => Promise<void>;
  requestTutoring: (tutor: string, amount: number) => Promise<void>;
  redeemTokens: (benefit: string) => Promise<void>;
  setRole: (user: string, roleIndex: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  loadUserRole: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contexto
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Configurar listeners de eventos del contrato
  useEffect(() => {
    if (state.wallet.isConnected) {
      // Listener para cuando se asignan tokens
      blockchainService.onTokensAssigned((to, amount) => {
        if (to.toLowerCase() === state.wallet.address?.toLowerCase()) {
          dispatch({ type: "UPDATE_BALANCE", payload: amount });
        }
      });

      // Listener para cuando se paga una tutoría
      blockchainService.onTutoringPaid((from, to, amount) => {
        if (
          from.toLowerCase() === state.wallet.address?.toLowerCase() ||
          to.toLowerCase() === state.wallet.address?.toLowerCase()
        ) {
          refreshBalance();
          loadTutoringHistory();
        }
      });

      // Listener para cuando se canjean tokens
      blockchainService.onTokensRedeemed((user) => {
        if (user.toLowerCase() === state.wallet.address?.toLowerCase()) {
          refreshBalance();
        }
      });
    }

    return () => {
      blockchainService.removeAllListeners();
    };
  }, [state.wallet.isConnected, state.wallet.address]);

  // Función para conectar wallet
  const connectWallet = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const { address, balance } = await blockchainService.connectWallet();

      const walletConnection: WalletConnection = {
        isConnected: true,
        address,
        balance,
      };

      dispatch({ type: "CONNECT_WALLET", payload: walletConnection });

      // Cargar rol del usuario
      await loadUserRole();
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

  // Función para cargar el rol del usuario
  const loadUserRole = async () => {
    if (!state.wallet.address) return;

    try {
      const role = await blockchainService.getRole(state.wallet.address);

      let userRole: "student" | "tutor" | "docente" = "student";

      switch (role) {
        case ContractRole.Docente:
          userRole = "docente";
          break;
        case ContractRole.Tutor:
          userRole = "tutor";
          break;
        case ContractRole.EstudianteConDificultad:
        case ContractRole.None:
        default:
          userRole = "student";
          break;
      }

      dispatch({ type: "SET_USER_ROLE", payload: userRole });
    } catch (error) {
      console.error("Error al cargar rol:", error);
    }
  };

  // Función para asignar tokens (solo docentes)
  const assignTokens = async (to: string, amount: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.assignTokens(to, amount);

      // Actualizar balance del destinatario si es el usuario actual
      if (to.toLowerCase() === state.wallet.address?.toLowerCase()) {
        await refreshBalance();
      }
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

  // Función para cargar tutores (simulada con direcciones de ejemplo)
  const loadTutors = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Para la demo, creamos tutores de ejemplo
      // En una implementación real, esto vendría de un backend o del blockchain
      const mockTutors: Tutor[] = [
        {
          id: "1",
          name: "Dr. Ana García",
          wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          subjects: ["Matemáticas", "Física"],
          rating: 4.8,
          hourlyRate: 50,
          isAvailable: true,
        },
        {
          id: "2",
          name: "Prof. Carlos López",
          wallet: "0x8ba1f109551bD432803012645Hac136c772c3c3",
          subjects: ["Programación", "Algoritmos"],
          rating: 4.9,
          hourlyRate: 60,
          isAvailable: true,
        },
        {
          id: "3",
          name: "Ing. María Rodríguez",
          wallet: "0x1234567890123456789012345678901234567890",
          subjects: ["Química", "Biología"],
          rating: 4.7,
          hourlyRate: 45,
          isAvailable: true,
        },
      ];

      dispatch({ type: "SET_TUTORS", payload: mockTutors });
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

      const tutorias = await blockchainService.getTutorias();

      // Convertir las tutorías del blockchain al formato de la app
      const history: TutoringSession[] = tutorias
        .filter(
          (tutoria) =>
            tutoria.estudiante.toLowerCase() ===
              state.wallet.address?.toLowerCase() ||
            tutoria.tutor.toLowerCase() === state.wallet.address?.toLowerCase()
        )
        .map((tutoria, index) => ({
          id: `session-${index}`,
          studentAddress: tutoria.estudiante,
          tutorAddress: tutoria.tutor,
          tutorName: `Tutor ${tutoria.tutor.slice(0, 6)}...`,
          subject: "Tutoría General",
          date: new Date(tutoria.timestamp * 1000).toISOString(),
          duration: 1,
          tokensPaid: tutoria.tokens,
          status: "completed" as const,
        }));

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
  const requestTutoring = async (tutor: string, amount: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.requestTutoring(tutor, amount);

      // Actualizar balance y historial
      await refreshBalance();
      await loadTutoringHistory();
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

  // Función para canjear tokens (solo tutores)
  const redeemTokens = async (benefit: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.redeemTokens(benefit);

      // Actualizar balance
      await refreshBalance();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al canjear tokens",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para establecer rol (solo owner)
  const setRole = async (user: string, roleIndex: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.setRole(user, roleIndex);

      // Si el usuario es el actual, actualizar su rol
      if (user.toLowerCase() === state.wallet.address?.toLowerCase()) {
        await loadUserRole();
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al establecer rol",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para refrescar balance
  const refreshBalance = async () => {
    if (!state.wallet.address) return;

    try {
      const balance = await blockchainService.getTokenBalance(
        state.wallet.address
      );
      dispatch({ type: "UPDATE_BALANCE", payload: balance });
    } catch (error) {
      console.error("Error al refrescar balance:", error);
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    connectWallet,
    assignTokens,
    loadTutors,
    loadTutoringHistory,
    requestTutoring,
    redeemTokens,
    setRole,
    refreshBalance,
    loadUserRole,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Hook para usar el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppProvider");
  }
  return context;
}
