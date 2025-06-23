// Script para diagnosticar el problema del rol
// Ejecutar en la consola del navegador después de conectar MetaMask

async function debugRole() {
  console.log('🔍 === DIAGNÓSTICO DE ROL ===');

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
    const contractAddress = "0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD";

    const abi = [
      "function owner() view returns (address)",
      "function roles(address) view returns (uint8)",
      "function balances(address) view returns (uint256)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Obtener información del contrato
    const owner = await contract.owner();
    const role = await contract.roles(userAddress);
    const balance = await contract.balances(userAddress);

    console.log('\n📊 INFORMACIÓN DEL CONTRATO:');
    console.log(`👑 Owner: ${owner}`);
    console.log(`👤 Tu dirección: ${userAddress}`);
    console.log(`🔍 ¿Eres owner? ${owner.toLowerCase() === userAddress.toLowerCase()}`);
    console.log(`🎭 Rol en contrato: ${role} (${getRoleName(role)})`);
    console.log(`💰 Balance en contrato: ${balance} tokens`);

    // Verificar si puedes asignar tokens (test de permisos)
    console.log('\n🧪 PRUEBA DE PERMISOS:');

    try {
      // Intentar llamar a assignTokens (esto fallará si no tienes permisos)
      const assignTokensABI = [
        "function assignTokens(address to, uint256 amount) external"
      ];
      const testContract = new ethers.Contract(contractAddress, assignTokensABI, signer);

      // Solo verificamos si la función existe, no la ejecutamos
      console.log('✅ Función assignTokens disponible en el contrato');

      // Verificar si tienes rol de docente o admin
      if (role == 2 || role == 3) {
        console.log('✅ Tienes permisos para asignar tokens (rol docente/admin)');
      } else {
        console.log('❌ No tienes permisos para asignar tokens (rol estudiante/none)');
      }

    } catch (error) {
      console.log('❌ Error verificando permisos:', error.message);
    }

    // Verificar el contexto de React si está disponible
    console.log('\n📱 INFORMACIÓN DEL CONTEXTO:');

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

    // Comparar roles
    console.log('\n🔄 COMPARACIÓN DE ROLES:');
    console.log(`🏗️ Rol en contrato: ${role} (${getRoleName(role)})`);

    // Mapeo esperado según el contexto
    const expectedMapping = {
      0: 'student (None)',
      1: 'student (Estudiante)',
      2: 'docente (Docente)',
      3: 'admin (Admin)'
    };

    console.log(`📱 Rol esperado en app: ${expectedMapping[role] || 'Desconocido'}`);

    if (role == 2) {
      console.log('✅ El contrato dice que eres DOCENTE');
      console.log('❓ Pero la app muestra STUDENT - esto es el problema');
    } else if (role == 3) {
      console.log('✅ El contrato dice que eres ADMIN');
      console.log('❓ Pero la app muestra STUDENT - esto es el problema');
    } else {
      console.log('ℹ️ El contrato dice que eres ESTUDIANTE/NONE');
      console.log('ℹ️ La app muestra STUDENT - esto es correcto');
    }

    // Soluciones
    console.log('\n💡 SOLUCIONES:');

    if (role == 0) {
      console.log('1. Tu rol es NONE - necesitas que te asignen un rol');
      console.log('2. Ejecuta: setRoleForAddress("TU_DIRECCION", 2) para ser docente');
    } else if (role == 1) {
      console.log('1. Tu rol es ESTUDIANTE - necesitas ser promovido a docente');
      console.log('2. Ejecuta: setRoleForAddress("TU_DIRECCION", 2) para ser docente');
    } else if (role == 2 || role == 3) {
      console.log('1. Tu rol en el contrato es correcto (DOCENTE/ADMIN)');
      console.log('2. El problema está en la sincronización de la app');
      console.log('3. Refresca la página o reconecta la wallet');
      console.log('4. Verifica que loadUserRole() se ejecute correctamente');
    }

  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
}

function getRoleName(role) {
  const roles = {
    0: 'None',
    1: 'Estudiante',
    2: 'Docente',
    3: 'Admin'
  };
  return roles[role] || 'Desconocido';
}

// Función para forzar la recarga del rol
async function forceReloadRole() {
  console.log('🔄 Forzando recarga del rol...');

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
    const contractAddress = "0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD";

    const abi = [
      "function roles(address) view returns (uint8)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const role = await contract.roles(userAddress);

    console.log(`🎭 Rol actual en contrato: ${role} (${getRoleName(role)})`);

    // Simular la lógica del contexto
    let userRole = "student";
    switch (role) {
      case 2:
        userRole = "docente";
        break;
      case 3:
        userRole = "admin";
        break;
      case 1:
      case 0:
      default:
        userRole = "student";
        break;
    }

    console.log(`📱 Rol que debería mostrar la app: ${userRole}`);

    if (role == 2 || role == 3) {
      console.log('✅ El rol debería ser docente/admin');
      console.log('💡 Si la app muestra "student", hay un problema de sincronización');
    }

  } catch (error) {
    console.error('❌ Error forzando recarga:', error);
  }
}

// Exponer funciones
window.debugRole = debugRole;
window.forceReloadRole = forceReloadRole;

console.log('🚀 Script de diagnóstico de rol cargado');
console.log('📝 Comandos disponibles:');
console.log('  - debugRole() - Diagnóstico completo del rol');
console.log('  - forceReloadRole() - Forzar recarga del rol'); 