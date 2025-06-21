# Mentorium - Plataforma de Tutorías Académicas

Una aplicación descentralizada (dApp) para conectar estudiantes con tutores académicos usando blockchain y tokens.

## 🚀 Características

- **Conectividad con MetaMask**: Integración completa con wallets de Ethereum
- **Gestión de Tokens**: Sistema de tokens (MTM) para pagar tutorías
- **Catálogo de Tutores**: Lista de tutores disponibles con sus especialidades
- **Solicitud de Tutorías**: Proceso completo de reserva de sesiones
- **Historial de Tutorías**: Seguimiento de todas las sesiones realizadas
- **Interfaz Responsiva**: Diseño moderno y adaptable a diferentes dispositivos
- **Simulación de Backend**: Datos mockeados para demostración

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Blockchain**: ethers.js (preparado para integración)
- **Estado**: React Context + useReducer
- **Build Tool**: Vite

## 📦 Instalación

1. **Clonar el repositorio**:
```bash
git clone <tu-repositorio>
cd mentorium
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Conectar MetaMask (simulado)
- [x] Ver saldo de tokens
- [x] Asignar tokens (simulado)
- [x] Lista de tutores disponibles
- [x] Solicitar tutorías
- [x] Historial de tutorías
- [x] Interfaz de usuario moderna
- [x] Gestión de estados y errores
- [x] Componentes reutilizables

### 🔄 Pendientes (Integración Real)
- [ ] Conexión real con MetaMask
- [ ] Integración con smart contracts
- [ ] Transacciones reales en blockchain
- [ ] Autenticación de usuarios
- [ ] Backend real

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Header.tsx      # Header principal
│   ├── WalletSection.tsx # Sección de wallet
│   ├── TokenSection.tsx  # Gestión de tokens
│   ├── TutorSection.tsx  # Lista de tutores
│   ├── TutoringHistory.tsx # Historial
│   ├── RequestTutoringModal.tsx # Modal de solicitud
│   ├── LoadingSpinner.tsx # Spinner de carga
│   └── ErrorMessage.tsx   # Mensajes de error
├── context/
│   └── AppContext.tsx  # Contexto global de la app
├── services/
│   └── mockBackend.ts  # Servicios mockeados
├── types/
│   └── index.ts        # Tipos TypeScript
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🔧 Configuración para Integración Real

### 1. Conectar con MetaMask

Reemplaza las funciones en `src/services/mockBackend.ts`:

```typescript
import { ethers } from 'ethers';

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
```

### 2. Configurar Smart Contracts

Crea un archivo `src/contracts/index.ts`:

```typescript
export const CONTRACT_ADDRESS = '0x...'; // Dirección de tu contrato
export const TOKEN_ADDRESS = '0x...';    // Dirección del token

export const CONTRACT_ABI = [...];       // ABI del contrato principal
export const TOKEN_ABI = [...];          // ABI del token
```

### 3. Variables de Entorno

Crea un archivo `.env`:

```env
VITE_CONTRACT_ADDRESS=0x...
VITE_TOKEN_ADDRESS=0x...
VITE_NETWORK_ID=11155111  # Sepolia testnet
```

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  },
}
```

### Estilos
Los estilos globales están en `src/index.css` con clases utilitarias de Tailwind.

## 🚀 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔒 Seguridad

- Validación de inputs en formularios
- Manejo de errores de conexión
- Verificación de saldo antes de transacciones
- Sanitización de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Próximos Pasos

1. **Integrar MetaMask real**
2. **Conectar con smart contracts**
3. **Implementar autenticación**
4. **Agregar más funcionalidades de tutor**
5. **Sistema de calificaciones**
6. **Notificaciones en tiempo real**

---

**Desarrollado con ❤️ para la educación descentralizada** 