// Comandos de debugging para Mentorium
// Ejecutar en la consola del navegador después de conectar MetaMask

// Función para mostrar información completa del estado
function showFullDebug() {
  console.log('🔍 === DEBUG COMPLETO DE MENTORIUM ===');

  // Información de MetaMask
  console.log('📱 MetaMask:', {
    isInstalled: !!window.ethereum,
    networkVersion: window.ethereum?.networkVersion,
    chainId: window.ethereum?.chainId,
    selectedAddress: window.ethereum?.selectedAddress
  });

  // Información del contexto (si está disponible)
  if (window.__MENTORIUM_CONTEXT__) {
    console.log('📊 Contexto de la App:', window.__MENTORIUM_CONTEXT__);
  }

  // Información del contrato
  console.log('🏗️ Contrato:', {
    address: '0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD',
    network: window.ethereum?.networkVersion || 'Desconocida'
  });

  console.log('=====================================');
}

// Función para verificar el estado del contrato
async function checkContractState() {
  console.log('🔍 Verificando estado del contrato...');

  if (!window.ethereum) {
    console.error('❌ MetaMask no está instalado');
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      console.error('❌ No hay cuenta conectada');
      return;
    }

    const userAddress = accounts[0];
    console.log('👤 Usuario:', userAddress);

    // Crear provider y signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = "0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD";

    const abi = [
      "function owner() view returns (address)",
      "function roles(address) view returns (uint8)",
      "function balances(address) view returns (uint256)",
      "function getNumeroOfertas() view returns (uint256)",
      "function getTutorias() view returns (tuple(address estudiante, address tutor, string materia, uint256 tokens, uint256 timestamp)[])"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const owner = await contract.owner();
    const balance = await contract.balances(userAddress);
    const role = await contract.roles(userAddress);
    const numOfertas = await contract.getNumeroOfertas();
    const tutorias = await contract.getTutorias();

    console.log('📊 Estado del contrato:');
    console.log(`👑 Owner: ${owner}`);
    console.log(`💰 Balance: ${balance} tokens`);
    console.log(`👤 Rol: ${role} (0=None, 1=Estudiante, 2=Docente, 3=Admin)`);
    console.log(`📚 Ofertas: ${numOfertas}`);
    console.log(`📖 Tutorías: ${tutorias.length}`);

    // Verificar si hay discrepancia
    if (balance == 0 && role == 0) {
      console.warn('⚠️  Usuario sin tokens ni rol asignado');
      console.log('💡 Ejecuta setupContract() si eres el owner');
    }

  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
}

// Función para simular acciones de la app
function simulateAppActions() {
  console.log('🎭 Simulando acciones de la app...');

  // Simular conexión de wallet
  console.log('1. Conectando wallet...');

  // Simular carga de datos
  console.log('2. Cargando ofertas...');
  console.log('3. Cargando historial...');

  // Simular errores comunes
  console.log('4. Verificando errores comunes...');

  const commonErrors = [
    'Balance muestra 0 tokens',
    'Rol no asignado',
    'Contrato no responde',
    'MetaMask no conectado'
  ];

  commonErrors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
}

// Función para mostrar ayuda
function showHelp() {
  console.log('📚 === COMANDOS DE DEBUGGING ===');
  console.log('');
  console.log('🔍 showFullDebug() - Muestra información completa del estado');
  console.log('📊 checkContractState() - Verifica el estado del contrato');
  console.log('🎭 simulateAppActions() - Simula acciones de la app');
  console.log('❓ showHelp() - Muestra esta ayuda');
  console.log('');
  console.log('🔧 COMANDOS DEL CONTRATO:');
  console.log('   setupContract() - Configurar contrato (solo owner)');
  console.log('   checkContractStatus() - Verificar estado del contrato');
  console.log('   assignTokensToAddress(address, amount) - Asignar tokens');
  console.log('   setRoleForAddress(address, roleIndex) - Configurar rol');
  console.log('');
  console.log('💡 TIP: Usa el panel de debug flotante en la app para más información');
  console.log('================================');
}

// Función para verificar si ethers está disponible
function checkEthers() {
  if (typeof ethers !== 'undefined') {
    console.log('✅ ethers.js está disponible');
    console.log('📦 Versión:', ethers.version);
  } else {
    console.error('❌ ethers.js no está disponible');
    console.log('💡 Asegúrate de estar en la página de la app');
  }
}

// Función para verificar el contexto de React
function checkReactContext() {
  console.log('🔍 Verificando contexto de React...');

  // Intentar acceder al contexto a través del DOM
  const appElement = document.querySelector('[data-reactroot]');
  if (appElement) {
    console.log('✅ React está montado');
  } else {
    console.log('❌ React no está montado');
  }
}

// Exponer funciones globalmente
window.showFullDebug = showFullDebug;
window.checkContractState = checkContractState;
window.simulateAppActions = simulateAppActions;
window.showHelp = showHelp;
window.checkEthers = checkEthers;
window.checkReactContext = checkReactContext;

// Mostrar ayuda automáticamente
console.log('🚀 Comandos de debugging cargados');
console.log('💡 Ejecuta showHelp() para ver todos los comandos disponibles'); 