import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  WalletConnection,
  User,
  Tutor,
  TutoringSession,
  OfertaTutoria,
} from "../types";
import { blockchainService, ContractRole } from "../services/blockchainService";

// Estado inicial de la aplicación
interface AppState {
  wallet: WalletConnection;
  user: User | null;
  tutors: Tutor[];
  ofertasTutoria: OfertaTutoria[];
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
  ofertasTutoria: [],
  tutoringHistory: [],
  loading: false,
  error: null,
};

// Acciones disponibles
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CONNECT_WALLET"; payload: WalletConnection }
  | { type: "SET_USER_ROLE"; payload: "student" | "docente" | "admin" }
  | { type: "SET_TUTORS"; payload: Tutor[] }
  | { type: "SET_OFERTAS_TUTORIA"; payload: OfertaTutoria[] }
  | { type: "SET_TUTORING_HISTORY"; payload: TutoringSession[] }
  | { type: "UPDATE_BALANCE"; payload: number }
  | { type: "ADD_OFERTA_TUTORIA"; payload: OfertaTutoria }
  | { type: "REMOVE_OFERTA_TUTORIA"; payload: number }
  | { type: "ADD_TUTORING_SESSION"; payload: TutoringSession };

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

    case "SET_OFERTAS_TUTORIA":
      return { ...state, ofertasTutoria: action.payload };

    case "SET_TUTORING_HISTORY":
      return { ...state, tutoringHistory: action.payload };

    case "UPDATE_BALANCE":
      return {
        ...state,
        wallet: { ...state.wallet, balance: action.payload },
      };

    case "ADD_OFERTA_TUTORIA":
      return {
        ...state,
        ofertasTutoria: [action.payload, ...state.ofertasTutoria],
      };

    case "REMOVE_OFERTA_TUTORIA":
      return {
        ...state,
        ofertasTutoria: state.ofertasTutoria.filter(
          (oferta) => oferta.id !== action.payload
        ),
      };

    case "ADD_TUTORING_SESSION":
      return {
        ...state,
        tutoringHistory: [action.payload, ...state.tutoringHistory],
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
  crearOfertaTutoria: (materia: string, precio: number) => Promise<void>;
  cancelarOfertaTutoria: (ofertaId: number) => Promise<void>;
  loadOfertasTutoria: () => Promise<void>;
  loadTutoringHistory: () => Promise<void>;
  requestTutoring: (ofertaId: number) => Promise<void>;
  redeemTokens: (benefit: string) => Promise<void>;
  setRole: (user: string, roleIndex: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  loadUserRole: () => Promise<void>;
  forceReloadRole: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contexto
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Efecto para cargar datos iniciales una vez que la wallet está conectada
  useEffect(() => {
    const loadInitialData = async () => {
      if (state.wallet.isConnected) {
        console.log("🚀 Cargando datos iniciales (ofertas e historial)...");
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          await loadOfertasTutoria();
          await loadTutoringHistory();
        } catch (error) {
          console.error("❌ Error al cargar datos iniciales:", error);
          dispatch({
            type: "SET_ERROR",
            payload: "No se pudieron cargar los datos iniciales.",
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };
    loadInitialData();
  }, [state.wallet.isConnected]);

  // Configurar listeners de eventos del contrato
  useEffect(() => {
    if (state.wallet.isConnected) {
      // Listener para cuando se asignan tokens
      blockchainService.onTokensAssigned((to, amount) => {
        if (to.toLowerCase() === state.wallet.address?.toLowerCase()) {
          dispatch({ type: "UPDATE_BALANCE", payload: amount });
        }
      });

      // Listener para cuando se crea una oferta
      blockchainService.onOfertaCreada((tutor, materia, precio) => {
        loadOfertasTutoria();
      });

      // Listener para cuando se cancela una oferta
      blockchainService.onOfertaCancelada((tutor, ofertaId) => {
        dispatch({ type: "REMOVE_OFERTA_TUTORIA", payload: ofertaId });
      });

      // Listener para cuando se paga una tutoría
      blockchainService.onTutoringPaid((from, to, amount, materia) => {
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
      console.log("🔄 Cargando rol para dirección:", state.wallet.address);
      const role = await blockchainService.getRole(state.wallet.address);
      console.log("🎭 Rol obtenido del contrato:", role);

      let userRole: "student" | "docente" | "admin" = "student";

      switch (role) {
        case ContractRole.Docente:
          userRole = "docente";
          console.log("✅ Rol mapeado a: docente");
          break;
        case ContractRole.Admin:
          userRole = "admin";
          console.log("✅ Rol mapeado a: admin");
          break;
        case ContractRole.Estudiante:
        case ContractRole.None:
        default:
          userRole = "student";
          console.log("✅ Rol mapeado a: student");
          break;
      }

      console.log("📱 Actualizando rol en contexto a:", userRole);
      dispatch({ type: "SET_USER_ROLE", payload: userRole });
    } catch (error) {
      console.error("❌ Error al cargar rol:", error);
    }
  };

  // Nueva función para forzar la recarga del rol
  const forceReloadRole = async () => {
    console.log("🔄 Forzando recarga del rol...");
    await loadUserRole();
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

  // Función para crear oferta de tutoría
  const crearOfertaTutoria = async (materia: string, precio: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.crearOfertaTutoria(materia, precio);

      console.log("✅ Oferta creada, forzando recarga de ofertas...");
      await loadOfertasTutoria();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al crear oferta",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para cancelar oferta de tutoría
  const cancelarOfertaTutoria = async (ofertaId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.cancelarOfertaTutoria(ofertaId);

      // Remover oferta del estado
      dispatch({ type: "REMOVE_OFERTA_TUTORIA", payload: ofertaId });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al cancelar oferta",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para cargar ofertas de tutoría
  const loadOfertasTutoria = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const ofertas = await blockchainService.getOfertasActivas();
      dispatch({ type: "SET_OFERTAS_TUTORIA", payload: ofertas });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al cargar ofertas",
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
          subject: tutoria.materia,
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
  const requestTutoring = async (ofertaId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await blockchainService.requestTutoring(ofertaId);

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

  // Función para canjear tokens
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
    crearOfertaTutoria,
    cancelarOfertaTutoria,
    loadOfertasTutoria,
    loadTutoringHistory,
    requestTutoring,
    redeemTokens,
    setRole,
    refreshBalance,
    loadUserRole,
    forceReloadRole,
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
