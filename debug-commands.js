// Script de comandos de depuración para la consola del navegador
// Copiar y pegar directamente en la consola después de conectar MetaMask

// ABI del contrato Mentorium actualizado
const MENTORIUM_ABI = [
  "function owner() view returns (address)",
  "function roles(address) view returns (uint8)",
  "function balances(address) view returns (uint256)",
  "function getBalance(address user) view returns (uint256)",
  "function setRole(address user, uint256 roleIndex) external",
  "function assignTokens(address to, uint256 amount) external"
];

// Dirección del contrato desplegado
const CONTRACT_ADDRESS = "0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD";

// Roles del smart contract actualizado
const ContractRole = {
  None: 0,
  Estudiante: 1,
  Docente: 2,
  Admin: 3
};

// Función para obtener información del usuario actual
async function getUserInfo() {
  console.log('🔍 === INFORMACIÓN DEL USUARIO ===');

  if (!window.ethereum) {
    console.error('❌ MetaMask no está instalado');
    return;
  }

  try {
    // Obtener cuenta conectada
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      console.error('❌ No hay cuenta conectada');
      return;
    }

    const userAddress = accounts[0];
    console.log('👤 Dirección del usuario:', userAddress);

    // Crear provider y signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, signer);

    // Obtener información del contrato
    const owner = await contract.owner();
    const role = await contract.roles(userAddress);
    const balance = await contract.getBalance(userAddress);

    console.log('\n📊 INFORMACIÓN DEL CONTRATO:');
    console.log(`👑 Owner: ${owner}`);
    console.log(`👤 Tu dirección: ${userAddress}`);
    console.log(`🔍 ¿Eres owner? ${owner.toLowerCase() === userAddress.toLowerCase()}`);
    console.log(`🎭 Rol en contrato: ${role} (${getRoleName(role)})`);
    console.log(`💰 Balance en contrato: ${balance} tokens`);

    // Mapeo esperado según el contexto
    const expectedMapping = {
      0: 'student (None)',
      1: 'student (Estudiante)',
      2: 'docente (Docente)',
      3: 'admin (Admin)'
    };

    console.log(`📱 Rol esperado en app: ${expectedMapping[role] || 'Desconocido'}`);

    return {
      address: userAddress,
      owner,
      role: Number(role),
      balance: Number(balance),
      isOwner: owner.toLowerCase() === userAddress.toLowerCase()
    };

  } catch (error) {
    console.error('❌ Error obteniendo información:', error);
    return null;
  }
}

// Función para obtener el nombre del rol
function getRoleName(role) {
  const roles = {
    0: 'None',
    1: 'Estudiante',
    2: 'Docente',
    3: 'Admin'
  };
  return roles[role] || 'Desconocido';
}

// Función para asignar rol a una dirección (solo owner)
async function setRoleForAddress(address, roleIndex) {
  console.log(`🔧 === ASIGNANDO ROL ===`);
  console.log(`📍 Dirección: ${address}`);
  console.log(`🎭 Rol: ${roleIndex} (${getRoleName(roleIndex)})`);

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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, signer);

    // Verificar si el usuario es owner
    const owner = await contract.owner();
    if (owner.toLowerCase() !== userAddress.toLowerCase()) {
      console.error('❌ Solo el owner puede asignar roles');
      return;
    }

    console.log('✅ Eres el owner, procediendo con la asignación...');

    // Ejecutar la transacción
    const tx = await contract.setRole(address, roleIndex);
    console.log('⏳ Transacción enviada:', tx.hash);

    await tx.wait();
    console.log('✅ Rol asignado exitosamente');

    // Verificar el nuevo rol
    const newRole = await contract.roles(address);
    console.log(`🎭 Nuevo rol de ${address}: ${newRole} (${getRoleName(newRole)})`);

  } catch (error) {
    console.error('❌ Error asignando rol:', error);
  }
}

// Función para asignar tokens (solo docentes/admin)
async function assignTokensToAddress(address, amount) {
  console.log(`💰 === ASIGNANDO TOKENS ===`);
  console.log(`📍 Dirección: ${address}`);
  console.log(`💎 Cantidad: ${amount} MTM`);

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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, signer);

    // Verificar rol del usuario
    const role = await contract.roles(userAddress);
    if (role != 2 && role != 3) {
      console.error('❌ Solo docentes y admins pueden asignar tokens');
      return;
    }

    console.log('✅ Tienes permisos para asignar tokens');

    // Ejecutar la transacción
    const tx = await contract.assignTokens(address, amount);
    console.log('⏳ Transacción enviada:', tx.hash);

    await tx.wait();
    console.log('✅ Tokens asignados exitosamente');

    // Verificar el nuevo balance
    const newBalance = await contract.getBalance(address);
    console.log(`💰 Nuevo balance de ${address}: ${newBalance} MTM`);

  } catch (error) {
    console.error('❌ Error asignando tokens:', error);
  }
}

// Función para verificar el contexto de React
function checkReactContext() {
  console.log('📱 === VERIFICANDO CONTEXTO DE REACT ===');

  // Intentar acceder al contexto de React
  const reactRoot = document.querySelector('[data-reactroot]');
  if (reactRoot) {
    console.log('✅ React está montado');

    // Buscar elementos que muestren el rol
    const roleElements = document.querySelectorAll('[class*="role"], [class*="Role"]');
    console.log(`🔍 Elementos con "role" en clase: ${roleElements.length}`);

    // Buscar texto que contenga "student", "docente", "admin"
    const bodyText = document.body.innerText;
    const roleMatches = bodyText.match(/(student|docente|admin)/gi);
    if (roleMatches) {
      console.log('📝 Texto encontrado en la página:', roleMatches);
    }
  } else {
    console.log('❌ React no está montado');
  }
}

// Función para forzar la recarga del rol en la app
async function forceReloadRoleInApp() {
  console.log('🔄 === FORZANDO RECARGA DEL ROL ===');

  // Verificar si la función forceReloadRole está disponible
  if (typeof window.forceReloadRole === 'function') {
    console.log('✅ Función forceReloadRole encontrada, ejecutando...');
    await window.forceReloadRole();
  } else {
    console.log('❌ Función forceReloadRole no encontrada');
    console.log('💡 Intenta recargar la página o reconectar la wallet');
  }
}

// Función principal de diagnóstico
async function debugRole() {
  console.log('🚀 === DIAGNÓSTICO COMPLETO DE ROL ===');

  const userInfo = await getUserInfo();
  if (!userInfo) return;

  console.log('\n🔄 === VERIFICANDO SINCRONIZACIÓN ===');
  checkReactContext();

  console.log('\n💡 === RECOMENDACIONES ===');

  if (userInfo.role == 0) {
    console.log('1. Tu rol es NONE - necesitas que te asignen un rol');
    console.log('2. Ejecuta: setRoleForAddress("TU_DIRECCION", 2) para ser docente');
  } else if (userInfo.role == 1) {
    console.log('1. Tu rol es ESTUDIANTE - necesitas ser promovido a docente');
    console.log('2. Ejecuta: setRoleForAddress("TU_DIRECCION", 2) para ser docente');
  } else if (userInfo.role == 2 || userInfo.role == 3) {
    console.log('1. Tu rol en el contrato es correcto (DOCENTE/ADMIN)');
    console.log('2. El problema está en la sincronización de la app');
    console.log('3. Ejecuta: forceReloadRoleInApp()');
    console.log('4. O recarga la página y reconecta la wallet');
  }
}

// Exponer funciones globalmente
window.getUserInfo = getUserInfo;
window.setRoleForAddress = setRoleForAddress;
window.assignTokensToAddress = assignTokensToAddress;
window.checkReactContext = checkReactContext;
window.forceReloadRoleInApp = forceReloadRoleInApp;
window.debugRole = debugRole;

console.log('🚀 Script de comandos de depuración cargado');
console.log('📝 Comandos disponibles:');
console.log('  - getUserInfo() - Obtener información del usuario');
console.log('  - setRoleForAddress(address, roleIndex) - Asignar rol');
console.log('  - assignTokensToAddress(address, amount) - Asignar tokens');
console.log('  - checkReactContext() - Verificar contexto de React');
console.log('  - forceReloadRoleInApp() - Forzar recarga del rol');
console.log('  - debugRole() - Diagnóstico completo'); 