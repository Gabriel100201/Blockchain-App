# Mentorium - Plataforma de Intercambio de Conocimiento con Blockchain

Mentorium es una plataforma descentralizada que permite a estudiantes intercambiar conocimientos mediante un sistema de tutorías basado en tokens blockchain. Los estudiantes pueden ser tanto tutores como aprendices, creando un ecosistema de aprendizaje colaborativo.

## 🚀 Características Principales

### Sistema de Roles
- **Estudiante**: Puede crear ofertas de tutoría, solicitar tutorías de otros estudiantes, ganar y gastar tokens
- **Docente**: Puede asignar tokens iniciales a estudiantes
- **Admin**: Gestión completa del sistema
- **None**: Sin rol asignado

### Funcionalidades
- **Conexión con MetaMask**: Integración completa con wallets de Ethereum
- **Gestión de Tokens**: Sistema de tokens MTM para transacciones
- **Ofertas de Tutoría**: Los estudiantes pueden crear y gestionar ofertas
- **Solicitud de Tutorías**: Sistema de pago con tokens para solicitar tutorías
- **Historial de Transacciones**: Seguimiento completo de todas las tutorías
- **Canje de Tokens**: Sistema de recompensas por beneficios
- **Panel de Debug**: Herramienta flotante para diagnosticar problemas

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MetaMask instalado en el navegador
- Cuenta en una red de prueba (Sepolia, Goerli, etc.)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd Blockchain-App

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Configuración del Contrato

**IMPORTANTE**: Si tu balance muestra 0 tokens, sigue estos pasos para configurar el nuevo contrato:

1. **Abre la consola del navegador** (F12 → Console)
2. **Copia y pega el contenido del archivo `setup-contract.js`** en la consola
3. **Ejecuta los siguientes comandos**:

```javascript
// Verificar el estado actual del contrato
checkContractStatus()

// Si eres el owner del contrato, configurarlo
setupContract()

// Si no eres el owner, solicitar al owner que ejecute:
// assignTokensToAddress("TU_DIRECCION_AQUI", 200)
// setRoleForAddress("TU_DIRECCION_AQUI", 1) // 1 = Estudiante, 2 = Docente
```

### Configuración Manual (si no eres el owner)

Si no eres el owner del contrato, el owner debe ejecutar:

```javascript
// Asignar 200 tokens a tu dirección
assignTokensToAddress("0xTU_DIRECCION_AQUI", 200)

// Configurar tu rol como estudiante
setRoleForAddress("0xTU_DIRECCION_AQUI", 1)

// O como docente si quieres asignar tokens
setRoleForAddress("0xTU_DIRECCION_AQUI", 2)
```

## 🔧 Panel de Debug

Mentorium incluye un panel de debug flotante que te ayuda a diagnosticar problemas:

### Cómo Usar el Panel de Debug

1. **Conecta tu wallet** a la aplicación
2. **Busca el botón azul flotante** en la esquina inferior derecha (⚙️)
3. **Haz clic en el botón** para abrir el panel de debug
4. **Revisa la información** mostrada en las diferentes secciones

### Información Disponible en el Panel

- **👤 Información Básica**: Dirección de wallet y estado de conexión
- **📊 Estado del Contexto**: Balance y rol según la aplicación
- **🏗️ Estado del Contrato**: Balance y rol según el smart contract
- **🌐 Información de Red**: Red actual y dirección del contrato
- **❌ Errores**: Mensajes de error si los hay
- **⚡ Acciones Rápidas**: Botones para log a consola y copiar JSON

### Comandos de Debug en Consola

También puedes usar comandos en la consola del navegador:

1. **Copia y pega el contenido de `debug-commands.js`** en la consola
2. **Ejecuta los comandos disponibles**:

```javascript
// Mostrar ayuda
showHelp()

// Verificar estado del contrato
checkContractState()

// Mostrar debug completo
showFullDebug()

// Verificar si ethers está disponible
checkEthers()
```

## 📋 Uso de la Plataforma

### Para Estudiantes

1. **Conectar Wallet**: Haz clic en "Conectar Wallet" y autoriza MetaMask
2. **Verificar Balance**: Tu saldo de tokens MTM se mostrará automáticamente
3. **Crear Oferta de Tutoría**:
   - Ve a "Mis Ofertas"
   - Haz clic en "Crear Nueva Oferta"
   - Especifica materia y precio en tokens
4. **Solicitar Tutoría**:
   - Ve a "Ofertas Disponibles"
   - Selecciona una oferta que te interese
   - Haz clic en "Solicitar Tutoría"
   - Confirma la transacción en MetaMask

### Para Docentes

1. **Asignar Tokens**: Ve al panel de docente
2. **Ingresa la dirección del estudiante** y la cantidad de tokens
3. **Confirma la transacción** en MetaMask

### Para Administradores

1. **Gestión de Roles**: Puedes asignar roles a cualquier dirección
2. **Supervisión**: Acceso completo a todas las funciones del sistema

## 🔧 Estructura del Proyecto

```
Blockchain-App/
├── src/
│   ├── components/          # Componentes React
│   │   ├── WalletSection.tsx
│   │   ├── TokenSection.tsx
│   │   ├── OfertasTutoriaSection.tsx
│   │   ├── MisOfertasSection.tsx
│   │   ├── TutoringHistory.tsx
│   │   ├── DocenteDashboard.tsx
│   │   ├── DebugPanel.tsx   # Panel de debug flotante
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx   # Contexto global de la aplicación
│   ├── services/
│   │   └── blockchainService.ts  # Servicio de interacción con blockchain
│   └── types/
│       └── index.ts         # Definiciones de tipos TypeScript
├── Mentorium.sol            # Smart contract principal
├── setup-contract.js        # Script de configuración del contrato
├── debug-commands.js        # Comandos de debugging
└── README.md
```

## 🏗️ Smart Contract

### Dirección del Contrato
```
0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD
```

### Funciones Principales

#### Gestión de Roles
- `setRole(address user, uint roleIndex)`: Asigna roles (solo owner)
- `roles(address user)`: Consulta el rol de una dirección

#### Gestión de Tokens
- `assignTokens(address to, uint amount)`: Asigna tokens (solo docentes)
- `getBalance(address user)`: Consulta el balance de tokens
- `redeemTokens(string benefit)`: Canjea tokens por beneficios

#### Ofertas de Tutoría
- `crearOfertaTutoria(string materia, uint precio)`: Crea una oferta
- `cancelarOfertaTutoria(uint ofertaId)`: Cancela una oferta
- `getOfertasActivas()`: Obtiene todas las ofertas activas
- `getOferta(uint ofertaId)`: Obtiene información de una oferta específica

#### Solicitud de Tutorías
- `requestTutoring(uint ofertaId)`: Solicita una tutoría
- `getTutorias()`: Obtiene el historial de tutorías

## 🔄 Flujo de Intercambio de Conocimiento

### 1. Configuración Inicial
```
Admin/Docente → Asigna tokens iniciales → Estudiantes
```

### 2. Creación de Ofertas
```
Estudiante → Crea oferta de tutoría → Especifica materia y precio
```

### 3. Solicitud de Tutorías
```
Estudiante A → Selecciona oferta → Paga tokens → Estudiante B (tutor)
```

### 4. Intercambio Bidireccional
```
Estudiante A puede ser tutor en Matemáticas
Estudiante B puede ser tutor en Programación
Ambos pueden aprender y enseñar simultáneamente
```

## 🛡️ Seguridad

- **Verificación de Roles**: Todas las funciones verifican permisos
- **Validación de Saldos**: Se verifica saldo suficiente antes de transacciones
- **Prevención de Auto-tutoría**: No se puede solicitar tutoría a uno mismo
- **Gestión de Ofertas**: Solo el creador puede cancelar sus ofertas

## 🐛 Solución de Problemas

### Balance Muestra 0 Tokens
1. Verifica que estés conectado con la dirección correcta
2. **Usa el panel de debug** para verificar el estado del contrato
3. Ejecuta `checkContractStatus()` en la consola
4. Si tu rol es 0 (None), solicita al owner que configure tu rol
5. Si no tienes tokens, solicita al owner que te asigne tokens

### Error al Conectar MetaMask
1. Verifica que MetaMask esté instalado
2. Asegúrate de estar en la red correcta
3. Autoriza el acceso a la aplicación

### Transacciones Fallan
1. Verifica que tengas ETH para gas
2. Confirma que tu rol te permita ejecutar la función
3. Verifica que tengas saldo suficiente de tokens

### Panel de Debug No Aparece
1. Asegúrate de estar conectado con MetaMask
2. Refresca la página
3. Verifica que no haya errores en la consola

### Información Inconsistente
1. **Usa el panel de debug** para comparar contexto vs contrato
2. Ejecuta `checkContractState()` en la consola
3. Si hay diferencias, el problema está en la sincronización

## 📝 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras problemas:
1. **Usa el panel de debug** para diagnosticar el problema
2. Revisa la consola del navegador para errores
3. Verifica que el contrato esté correctamente configurado
4. Asegúrate de estar en la red blockchain correcta
5. Contacta al equipo de desarrollo con los detalles del error

---

**Mentorium** - Transformando la educación mediante blockchain y colaboración descentralizada. 