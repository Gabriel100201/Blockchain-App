// Tipos para la aplicación Mentorium

export interface User {
  address: string;
  role: 'student' | 'tutor';
  name?: string;
}

export interface Tutor {
  id: string;
  name: string;
  wallet: string;
  subjects: string[];
  rating: number;
  hourlyRate: number; // en tokens
  isAvailable: boolean;
}

export interface TutoringSession {
  id: string;
  studentAddress: string;
  tutorAddress: string;
  tutorName: string;
  subject: string;
  date: string;
  duration: number; // en horas
  tokensPaid: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface WalletConnection {
  isConnected: boolean;
  address: string | null;
  balance: number; // en tokens
}

// Tipos para las funciones mock que simulan el backend
export interface MockBackend {
  connectWallet: () => Promise<WalletConnection>;
  getBalance: (address: string) => Promise<number>;
  assignTokens: (address: string, amount: number) => Promise<number>;
  getTutors: () => Promise<Tutor[]>;
  requestTutoring: (session: Omit<TutoringSession, 'id' | 'status'>) => Promise<TutoringSession>;
  getTutoringHistory: (address: string) => Promise<TutoringSession[]>;
  updateSessionStatus: (sessionId: string, status: 'pending' | 'completed' | 'cancelled') => Promise<void>;
} 