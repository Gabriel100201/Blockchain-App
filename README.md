# Mentorium - Plataforma de Tutorías con Blockchain

Una aplicación descentralizada (dApp) que permite a estudiantes solicitar tutorías y a tutores recibir pagos en tokens, todo gestionado a través de smart contracts en la blockchain.

## 🚀 Características Principales

### Para Estudiantes:
- ✅ Conectar wallet con MetaMask
- ✅ Ver saldo de tokens
- ✅ Explorar tutores disponibles
- ✅ Solicitar tutorías pagando con tokens

### Para Tutores:
- ✅ Ver saldo de tokens ganados
- ✅ Canjear tokens por beneficios
- ✅ Ver historial de tutorías realizadas

### Para Docentes:
- ✅ Asignar tokens a estudiantes
- ✅ Gestionar roles de usuarios (solo owner)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Ethereum (Smart Contract en Solidity)
- **Wallet**: MetaMask
- **Librerías**: ethers.js v6
- **Styling**: Tailwind CSS

## 📋 Requisitos Previos

1. **MetaMask instalado** en tu navegador
2. **Cuenta de Ethereum** (puede ser en testnet)
3. **Node.js** (versión 16 o superior)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd Blockchain-App
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar MetaMask
- Asegúrate de tener MetaMask instalado
- Conecta tu wallet a la red correspondiente (mainnet o testnet)
- Ten algunos ETH para gas fees

### 4. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎯 Guía de Demo

### Paso 1: Conectar Wallet
1. Abre la aplicación en tu navegador
2. Haz clic en "Conectar MetaMask"
3. Acepta la conexión en MetaMask
4. Verifica que tu dirección aparezca en la interfaz

### Paso 2: Demo como Estudiante
1. **Ver tu saldo**: El saldo de tokens se muestra en la sección de wallet
2. **Explorar tutores**: Ve a la sección "Tutores Disponibles"
3. **Solicitar tutoría**: 
   - Selecciona un tutor
   - Completa el formulario (materia, duración)
   - Confirma la transacción en MetaMask
   - Los tokens se transferirán automáticamente

### Paso 3: Demo como Tutor
1. **Ver saldo ganado**: Los tokens recibidos aparecen en tu balance
2. **Canjear tokens**:
   - Ve a la sección "Canjear Tokens por Beneficios"
   - Ingresa el beneficio deseado
   - Confirma la transacción
   - Todos los tokens se quemarán y recibirás el beneficio

### Paso 4: Demo como Docente
1. **Asignar tokens**:
   - Ve a la sección "Asignar Tokens a Estudiantes"
   - Ingresa la dirección del estudiante
   - Especifica la cantidad de tokens
   - Confirma la transacción

2. **Gestionar roles** (solo owner):
   - Ve a la sección "Gestionar Roles de Usuarios"
   - Ingresa la dirección del usuario
   - Selecciona el rol (Docente, Estudiante, Tutor)
   - Confirma la transacción

## 🔗 Smart Contract

- **Dirección**: `0xb0F8f553de2B98448e66Bd7040Ae430a313Ce9A1`
- **Red**: Ethereum Mainnet (o la red donde esté desplegado)
- **Archivo**: `Mentorium.sol`

### Funciones Principales del Contrato:
- `assignTokens(address to, uint amount)` - Asignar tokens (solo docentes)
- `requestTutoring(address tutor, uint amount)` - Solicitar tutoría
- `redeemTokens(string benefit)` - Canjear tokens (solo tutores)
- `setRole(address user, uint roleIndex)` - Establecer rol (solo owner)

## 🎨 Roles del Sistema

### Estudiante (por defecto)
- Puede solicitar tutorías
- Usa tokens para pagar servicios

### Tutor (rol 3)
- Recibe tokens por tutorías
- Puede canjear tokens por beneficios

### Docente (rol 1)
- Puede asignar tokens a estudiantes
- Gestiona el sistema educativo

### Owner
- Puede cambiar roles de usuarios
- Control total del contrato

## 🔧 Configuración Avanzada

### Cambiar Red de Blockchain
Si necesitas cambiar la red, modifica la dirección del contrato en:
```typescript
// src/services/blockchainService.ts
const CONTRACT_ADDRESS = 'tu-nueva-direccion';
```

### Personalizar Tutores
Los tutores se muestran desde datos mock. Para una implementación real, modifica:
```typescript
// src/context/AppContext.tsx - función loadTutors()
```

## 🐛 Solución de Problemas

### Error: "MetaMask no está instalado"
- Instala MetaMask desde [metamask.io](https://metamask.io)
- Refresca la página

### Error: "No se pudo conectar a MetaMask"
- Asegúrate de estar en la red correcta
- Verifica que MetaMask esté desbloqueado
- Intenta desconectar y reconectar

### Error: "Saldo insuficiente"
- Verifica que tengas tokens asignados
- Los docentes pueden asignarte tokens

### Error: "Solo docentes pueden ejecutar esto"
- Verifica que tu dirección tenga rol de docente
- Solo el owner puede cambiar roles

## 📝 Notas Importantes

- **Gas Fees**: Todas las transacciones requieren ETH para gas fees
- **Confirmaciones**: Las transacciones pueden tomar unos segundos
- **Roles**: Los roles se asignan por dirección de wallet
- **Tokens**: Los tokens son específicos de este contrato (no ERC-20 estándar)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de solución de problemas
2. Verifica que estés en la red correcta
3. Asegúrate de tener ETH para gas fees
4. Contacta al equipo de desarrollo

---

**¡Disfruta explorando el futuro de la educación descentralizada! 🎓✨** 