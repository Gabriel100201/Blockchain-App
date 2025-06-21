import { WalletConnection, Tutor, TutoringSession, MockBackend } from '../types';

// Datos mock para simular la base de datos
let mockBalance = 10; // Saldo inicial
let mockTutoringHistory: TutoringSession[] = [
  {
    id: '1',
    studentAddress: '0x1234567890123456789012345678901234567890',
    tutorAddress: '0x0987654321098765432109876543210987654321',
    tutorName: 'Dr. María González',
    subject: 'Matemáticas',
    date: '2024-01-15',
    duration: 2,
    tokensPaid: 20,
    status: 'completed'
  },
  {
    id: '2',
    studentAddress: '0x1234567890123456789012345678901234567890',
    tutorAddress: '0x1122334455667788990011223344556677889900',
    tutorName: 'Prof. Carlos Ruiz',
    subject: 'Física',
    date: '2024-01-20',
    duration: 1.5,
    tokensPaid: 15,
    status: 'pending'
  }
];

const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'Dr. María González',
    wallet: '0x0987654321098765432109876543210987654321',
    subjects: ['Matemáticas', 'Cálculo', 'Álgebra'],
    rating: 4.8,
    hourlyRate: 10,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Prof. Carlos Ruiz',
    wallet: '0x1122334455667788990011223344556677889900',
    subjects: ['Física', 'Química', 'Termodinámica'],
    rating: 4.6,
    hourlyRate: 12,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Lic. Ana Martínez',
    wallet: '0x2233445566778899001122334455667788990011',
    subjects: ['Programación', 'JavaScript', 'React'],
    rating: 4.9,
    hourlyRate: 15,
    isAvailable: false
  }
];

// Simulación de delay para hacer las llamadas más realistas
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockBackend: MockBackend = {
  // Conectar wallet (simula MetaMask)
  connectWallet: async (): Promise<WalletConnection> => {
    await delay(1000); // Simular delay de conexión
    
    // Simular dirección de wallet aleatoria
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    return {
      isConnected: true,
      address: mockAddress,
      balance: mockBalance
    };
  },

  // Obtener saldo de tokens
  getBalance: async (address: string): Promise<number> => {
    await delay(500);
    return mockBalance;
  },

  // Asignar tokens (simula mint de tokens)
  assignTokens: async (address: string, amount: number): Promise<number> => {
    await delay(800);
    mockBalance += amount;
    return mockBalance;
  },

  // Obtener lista de tutores
  getTutors: async (): Promise<Tutor[]> => {
    await delay(300);
    return mockTutors;
  },

  // Solicitar tutoría
  requestTutoring: async (session: Omit<TutoringSession, 'id' | 'status'>): Promise<TutoringSession> => {
    await delay(1000);
    
    // Verificar saldo suficiente
    if (mockBalance < session.tokensPaid) {
      throw new Error('Saldo insuficiente de tokens');
    }
    
    // Restar tokens del saldo
    mockBalance -= session.tokensPaid;
    
    // Crear nueva sesión
    const newSession: TutoringSession = {
      ...session,
      id: Date.now().toString(),
      status: 'pending'
    };
    
    // Agregar al historial
    mockTutoringHistory.push(newSession);
    
    return newSession;
  },

  // Obtener historial de tutorías
  getTutoringHistory: async (address: string): Promise<TutoringSession[]> => {
    await delay(400);
    return mockTutoringHistory.filter(session => 
      session.studentAddress.toLowerCase() === address.toLowerCase()
    );
  }
};

// TODO: FUNCIONES PARA REEMPLAZAR CON CONTRATO REAL
/*
Estas son las funciones que deberás reemplazar cuando conectes con el smart contract:

1. connectWallet() -> Usar ethers.js para conectar con MetaMask
2. getBalance() -> Llamar al método balanceOf() del contrato de tokens
3. assignTokens() -> Llamar al método mint() del contrato de tokens
4. requestTutoring() -> Llamar al método requestTutoring() del contrato principal
5. getTutoringHistory() -> Llamar a eventos del contrato o método getSessions()

Ejemplo de integración futura:
```typescript
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contracts';

export const connectWallet = async (): Promise<WalletConnection> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask no está instalado');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  // Conectar con el contrato de tokens
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
  const balance = await tokenContract.balanceOf(address);
  
  return {
    isConnected: true,
    address,
    balance: Number(ethers.formatEther(balance))
  };
};
*/ 