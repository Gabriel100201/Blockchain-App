# Guía de Integración - MetaMask y Smart Contracts

Esta guía te ayudará a reemplazar las funciones mockeadas con integración real de MetaMask y smart contracts.

## 🔗 Paso 1: Configurar MetaMask

### 1.1 Instalar MetaMask
- Descarga MetaMask desde [metamask.io](https://metamask.io/)
- Crea una nueva wallet o importa una existente
- Asegúrate de estar conectado a la red correcta (Sepolia testnet para desarrollo)

### 1.2 Configurar Red de Prueba
En MetaMask, agrega la red Sepolia:
- **Nombre de Red**: Sepolia Testnet
- **URL RPC**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **ID de Cadena**: `11155111`
- **Símbolo de Moneda**: `ETH`
- **URL del Explorador**: `https://sepolia.etherscan.io`

## 🔧 Paso 2: Crear Archivo de Configuración de Contratos

Crea el archivo `src/contracts/index.ts`:

```typescript
// Direcciones de los contratos (reemplaza con las tuyas)
export const CONTRACT_ADDRESS = '0x...'; // Contrato principal de Mentorium
export const TOKEN_ADDRESS = '0x...';    // Contrato del token MTM

// ABI del contrato principal (reemplaza con el ABI real)
export const CONTRACT_ABI = [
  // Función para solicitar tutoría
  {
    "inputs": [
      {"name": "tutorAddress", "type": "address"},
      {"name": "subject", "type": "string"},
      {"name": "duration", "type": "uint256"},
      {"name": "tokensAmount", "type": "uint256"}
    ],
    "name": "requestTutoring",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Evento de tutoría solicitada
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "sessionId", "type": "uint256"},
      {"indexed": true, "name": "student", "type": "address"},
      {"indexed": true, "name": "tutor", "type": "address"},
      {"indexed": false, "name": "subject", "type": "string"},
      {"indexed": false, "name": "tokensPaid", "type": "uint256"}
    ],
    "name": "TutoringRequested",
    "type": "event"
  }
];

// ABI del token (reemplaza con el ABI real)
export const TOKEN_ABI = [
  // Función para obtener balance
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Función para transferir tokens
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Función para aprobar gastos
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
```

## 🔄 Paso 3: Reemplazar Funciones Mock

### 3.1 Actualizar `src/services/mockBackend.ts`

Reemplaza el contenido con funciones reales:

```typescript
import { ethers } from 'ethers';
import { WalletConnection, Tutor, TutoringSession, MockBackend } from '../types';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, CONTRACT_ABI, TOKEN_ABI } from '../contracts';

// Verificar si MetaMask está disponible
const checkMetaMask = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask no está instalado. Por favor, instala MetaMask.');
  }
  return window.ethereum;
};

// Obtener provider y signer
const getProviderAndSigner = async () => {
  const ethereum = checkMetaMask();
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
};

export const realBackend: MockBackend = {
  // Conectar wallet
  connectWallet: async (): Promise<WalletConnection> => {
    try {
      const ethereum = checkMetaMask();
      
      // Solicitar conexión de cuentas
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const address = accounts[0];
      const { signer } = await getProviderAndSigner();
      
      // Conectar con contrato de tokens
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const balance = await tokenContract.balanceOf(address);
      
      return {
        isConnected: true,
        address,
        balance: Number(ethers.formatEther(balance))
      };
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw new Error('Error al conectar con MetaMask');
    }
  },

  // Obtener saldo de tokens
  getBalance: async (address: string): Promise<number> => {
    try {
      const { signer } = await getProviderAndSigner();
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const balance = await tokenContract.balanceOf(address);
      return Number(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      throw new Error('Error al obtener el saldo de tokens');
    }
  },

  // Asignar tokens (mint)
  assignTokens: async (address: string, amount: number): Promise<number> => {
    try {
      const { signer } = await getProviderAndSigner();
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      
      // Convertir a wei
      const amountWei = ethers.parseEther(amount.toString());
      
      // Llamar función mint (asumiendo que existe)
      const tx = await tokenContract.mint(address, amountWei);
      await tx.wait();
      
      // Obtener nuevo balance
      const newBalance = await tokenContract.balanceOf(address);
      return Number(ethers.formatEther(newBalance));
    } catch (error) {
      console.error('Error asignando tokens:', error);
      throw new Error('Error al asignar tokens');
    }
  },

  // Solicitar tutoría
  requestTutoring: async (session: Omit<TutoringSession, 'id' | 'status'>): Promise<TutoringSession> => {
    try {
      const { signer } = await getProviderAndSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Convertir tokens a wei
      const tokensWei = ethers.parseEther(session.tokensPaid.toString());
      
      // Llamar función del contrato
      const tx = await contract.requestTutoring(
        session.tutorAddress,
        session.subject,
        session.duration,
        tokensWei
      );
      
      // Esperar confirmación
      const receipt = await tx.wait();
      
      // Buscar evento de tutoría solicitada
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'TutoringRequested';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = contract.interface.parseLog(event);
        const sessionId = parsed.args.sessionId.toString();
        
        return {
          ...session,
          id: sessionId,
          status: 'pending'
        };
      }
      
      throw new Error('No se pudo confirmar la solicitud de tutoría');
    } catch (error) {
      console.error('Error solicitando tutoría:', error);
      throw new Error('Error al solicitar tutoría');
    }
  },

  // Obtener historial de tutorías
  getTutoringHistory: async (address: string): Promise<TutoringSession[]> => {
    try {
      const { provider } = await getProviderAndSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Obtener eventos de tutorías solicitadas
      const events = await contract.queryFilter('TutoringRequested', 0, 'latest');
      
      // Filtrar eventos del usuario
      const userEvents = events.filter((event: any) => {
        const parsed = contract.interface.parseLog(event);
        return parsed.args.student.toLowerCase() === address.toLowerCase();
      });
      
      // Convertir eventos a sesiones
      return userEvents.map((event: any) => {
        const parsed = contract.interface.parseLog(event);
        return {
          id: parsed.args.sessionId.toString(),
          studentAddress: parsed.args.student,
          tutorAddress: parsed.args.tutor,
          tutorName: 'Tutor', // Esto debería venir de otro lugar
          subject: parsed.args.subject,
          date: new Date().toISOString().split('T')[0], // Esto debería venir del evento
          duration: 1, // Esto debería venir del evento
          tokensPaid: Number(ethers.formatEther(parsed.args.tokensPaid)),
          status: 'pending' // Esto debería venir del estado del contrato
        };
      });
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw new Error('Error al obtener historial de tutorías');
    }
  },

  // Obtener tutores (esto podría venir de un backend o IPFS)
  getTutors: async (): Promise<Tutor[]> => {
    // Por ahora, mantener datos mockeados
    // En el futuro, esto podría venir de un backend o IPFS
    return [
      {
        id: '1',
        name: 'Dr. María González',
        wallet: '0x0987654321098765432109876543210987654321',
        subjects: ['Matemáticas', 'Cálculo', 'Álgebra'],
        rating: 4.8,
        hourlyRate: 10,
        isAvailable: true
      },
      // ... más tutores
    ];
  }
};
```

### 3.2 Actualizar el Contexto

En `src/context/AppContext.tsx`, reemplaza la importación:

```typescript
// Cambiar esta línea:
import { mockBackend } from '../services/mockBackend';

// Por esta:
import { realBackend } from '../services/mockBackend';
```

Y actualizar todas las referencias de `mockBackend` a `realBackend`.

## 🔐 Paso 4: Manejo de Errores y Validaciones

### 4.1 Agregar Validaciones de Red

```typescript
// En src/services/mockBackend.ts
const validateNetwork = async () => {
  const ethereum = checkMetaMask();
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  
  // Sepolia testnet
  if (chainId !== '0xaa36a7') {
    throw new Error('Por favor, conecta a la red Sepolia testnet');
  }
};
```

### 4.2 Manejo de Transacciones

```typescript
const waitForTransaction = async (tx: any) => {
  try {
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transacción cancelada por el usuario');
    }
    throw error;
  }
};
```

## 🧪 Paso 5: Testing

### 5.1 Probar Conexión
1. Ejecuta `npm run dev`
2. Abre la aplicación en el navegador
3. Haz clic en "Conectar MetaMask"
4. Acepta la conexión en MetaMask
5. Verifica que se muestre la dirección y el saldo

### 5.2 Probar Transacciones
1. Asigna algunos tokens
2. Solicita una tutoría
3. Verifica que se actualice el saldo
4. Revisa el historial

## 🚨 Consideraciones Importantes

### Seguridad
- **Nunca** expongas claves privadas en el código
- Siempre valida las direcciones de contratos
- Maneja errores de transacciones correctamente
- Verifica el saldo antes de realizar transacciones

### UX
- Muestra indicadores de carga durante transacciones
- Proporciona feedback claro sobre el estado de las transacciones
- Permite cancelar transacciones pendientes
- Muestra errores de manera amigable

### Gas
- Considera el costo de gas en las transacciones
- Permite al usuario ajustar el gas si es necesario
- Muestra estimaciones de gas antes de confirmar

## 📚 Recursos Adicionales

- [Documentación de ethers.js](https://docs.ethers.org/)
- [Documentación de MetaMask](https://docs.metamask.io/)
- [Guía de Smart Contracts](https://solidity-by-example.org/)
- [Testnet Faucets](https://faucet.sepolia.dev/)

## 🔄 Migración Gradual

Si quieres migrar gradualmente:

1. **Fase 1**: Solo conectar MetaMask
2. **Fase 2**: Leer datos reales (balance, historial)
3. **Fase 3**: Escribir datos reales (transacciones)
4. **Fase 4**: Optimizar y mejorar UX

Esto te permitirá probar cada parte por separado y asegurar que todo funcione correctamente antes de continuar. 