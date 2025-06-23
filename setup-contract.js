// Script para configurar el nuevo contrato Mentorium
// Ejecutar en la consola del navegador después de conectar MetaMask

async function setupContract() {
  console.log('🔧 Configurando contrato Mentorium...');

  // Verificar que MetaMask esté conectado
  if (!window.ethereum) {
    console.error('❌ MetaMask no está instalado');
    return;
  }

  try {
    // Obtener la cuenta conectada
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      console.error('❌ No hay cuenta conectada');
      return;
    }

    const userAddress = accounts[0];
    console.log('👤 Usuario conectado:', userAddress);

    // Crear provider y signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Dirección del contrato
    const contractAddress = "0xb64be4F86739eb3A85B1B2A8f6E1036B14d356fD";

    // ABI simplificado para las funciones que necesitamos
    const abi = [
      "function owner() view returns (address)",
      "function roles(address) view returns (uint8)",
      "function balances(address) view returns (uint256)",
      "function setRole(address user, uint256 roleIndex) external",
      "function assignTokens(address to, uint256 amount) external"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Verificar si el usuario es owner
    const owner = await contract.owner();
    console.log('👑 Owner del contrato:', owner);
    console.log('👤 Tu dirección:', userAddress);
    console.log('🔍 ¿Eres owner?', owner.toLowerCase() === userAddress.toLowerCase());

    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      console.log('✅ Eres el owner del contrato');

      // Configurar roles de ejemplo
      const rolesToSet = [
        { address: userAddress, role: 2 }, // Docente
        // Agregar más direcciones aquí si es necesario
      ];

      for (const { address, role } of rolesToSet) {
        try {
          console.log(`🔧 Configurando rol ${role} para ${address}...`);
          const tx = await contract.setRole(address, role);
          await tx.wait();
          console.log(`✅ Rol ${role} configurado para ${address}`);
        } catch (error) {
          console.error(`❌ Error configurando rol para ${address}:`, error.message);
        }
      }

      // Asignar tokens iniciales
      try {
        console.log('💰 Asignando tokens iniciales...');
        const tx = await contract.assignTokens(userAddress, 200);
        await tx.wait();
        console.log('✅ 200 tokens asignados');
      } catch (error) {
        console.error('❌ Error asignando tokens:', error.message);
      }

    } else {
      console.log('❌ No eres el owner del contrato');
      console.log('💡 Contacta al owner para que configure tu rol y tokens');
    }

    // Verificar estado final
    console.log('\n📊 Estado final:');
    const balance = await contract.balances(userAddress);
    const role = await contract.roles(userAddress);
    console.log(`💰 Balance: ${balance} tokens`);
    console.log(`👤 Rol: ${role} (0=None, 1=Estudiante, 2=Docente, 3=Admin)`);

  } catch (error) {
    console.error('❌ Error en la configuración:', error);
  }
}

// Función para verificar el estado del contrato
async function checkContractStatus() {
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
    console.log(`👤 Tu dirección: ${userAddress}`);
    console.log(`💰 Tu balance: ${balance} tokens`);
    console.log(`👤 Tu rol: ${role} (0=None, 1=Estudiante, 2=Docente, 3=Admin)`);
    console.log(`📚 Número de ofertas: ${numOfertas}`);
    console.log(`📖 Número de tutorías: ${tutorias.length}`);

  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
}

// Función para asignar tokens a una dirección específica
async function assignTokensToAddress(address, amount) {
  console.log(`💰 Asignando ${amount} tokens a ${address}...`);

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
      "function assignTokens(address to, uint256 amount) external"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.assignTokens(address, amount);
    await tx.wait();
    console.log(`✅ ${amount} tokens asignados a ${address}`);

  } catch (error) {
    console.error('❌ Error asignando tokens:', error.message);
  }
}

// Función para establecer rol de una dirección
async function setRoleForAddress(address, roleIndex) {
  console.log(`🔧 Configurando rol ${roleIndex} para ${address}...`);

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
      "function setRole(address user, uint256 roleIndex) external"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.setRole(address, roleIndex);
    await tx.wait();
    console.log(`✅ Rol ${roleIndex} configurado para ${address}`);

  } catch (error) {
    console.error('❌ Error configurando rol:', error.message);
  }
}

// Exponer funciones globalmente
window.setupContract = setupContract;
window.checkContractStatus = checkContractStatus;
window.assignTokensToAddress = assignTokensToAddress;
window.setRoleForAddress = setRoleForAddress;

console.log('🚀 Script de configuración cargado');
console.log('📝 Comandos disponibles:');
console.log('  - setupContract() - Configurar contrato inicial');
console.log('  - checkContractStatus() - Verificar estado del contrato');
console.log('  - assignTokensToAddress(address, amount) - Asignar tokens');
console.log('  - setRoleForAddress(address, roleIndex) - Configurar rol'); 