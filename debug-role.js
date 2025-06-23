// Script para diagnosticar el problema del rol
// Ejecutar en la consola del navegador después de conectar MetaMask

const { ethers } = require('ethers');

// ABI del contrato Mentorium actualizado
const MENTORIUM_ABI = [
  "function owner() view returns (address)",
  "function roles(address) view returns (uint8)",
  "function balances(address) view returns (uint256)",
  "function ofertasTutoria(uint256) view returns (address tutor, string materia, uint256 precio, bool activa, uint256 timestamp)",
  "function tutorias(uint256) view returns (address estudiante, address tutor, string materia, uint256 tokens, uint256 timestamp)",
  "function setRole(address user, uint256 roleIndex) external",
  "function assignTokens(address to, uint256 amount) external",
  "function crearOfertaTutoria(string memory materia, uint256 precio) external",
  "function cancelarOfertaTutoria(uint256 ofertaId) external",
  "function requestTutoring(uint256 ofertaId) external",
  "function redeemTokens(string benefit) external",
  "function getBalance(address user) view returns (uint256)",
  "function getNumeroOfertas() view returns (uint256)",
  "function getOfertasActivas() view returns (tuple(address tutor, string materia, uint256 precio, bool activa, uint256 timestamp)[])",
  "function getTutorias() view returns (tuple(address estudiante, address tutor, string materia, uint256 tokens, uint256 timestamp)[])",
  "function getOfertasPorTutor(address tutor) view returns (uint256[])",
  "function getOferta(uint256 ofertaId) view returns (tuple(address tutor, string materia, uint256 precio, bool activa, uint256 timestamp))",
  "event TokensAssigned(address indexed to, uint256 amount)",
  "event OfertaCreada(address indexed tutor, string materia, uint256 precio)",
  "event OfertaCancelada(address indexed tutor, uint256 ofertaId)",
  "event TutoringPaid(address indexed from, address indexed to, uint256 amount, string materia)",
  "event TokensRedeemed(address indexed user, string benefit)"
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

// Función para obtener el rol de una dirección
async function getRole(address) {
  try {
    // Crear provider (usando Infura o similar)
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");

    // Crear instancia del contrato
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, provider);

    console.log(`🔍 Consultando rol para dirección: ${address}`);
    const role = await contract.roles(address);
    const roleNumber = Number(role);

    console.log(`🎭 Rol obtenido: ${roleNumber}`);

    let roleName;
    switch (roleNumber) {
      case ContractRole.None:
        roleName = "None";
        break;
      case ContractRole.Estudiante:
        roleName = "Estudiante";
        break;
      case ContractRole.Docente:
        roleName = "Docente";
        break;
      case ContractRole.Admin:
        roleName = "Admin";
        break;
      default:
        roleName = "Desconocido";
    }

    console.log(`✅ Rol mapeado: ${roleName}`);
    return { roleNumber, roleName };

  } catch (error) {
    console.error("❌ Error al obtener rol:", error);
    return null;
  }
}

// Función para obtener el balance de una dirección
async function getBalance(address) {
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, provider);

    console.log(`💰 Consultando balance para dirección: ${address}`);
    const balance = await contract.getBalance(address);
    const balanceNumber = Number(balance);

    console.log(`✅ Balance obtenido: ${balanceNumber} MTM`);
    return balanceNumber;

  } catch (error) {
    console.error("❌ Error al obtener balance:", error);
    return 0;
  }
}

// Función para verificar el owner del contrato
async function getOwner() {
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, provider);

    console.log("👑 Consultando owner del contrato...");
    const owner = await contract.owner();

    console.log(`✅ Owner del contrato: ${owner}`);
    return owner;

  } catch (error) {
    console.error("❌ Error al obtener owner:", error);
    return null;
  }
}

// Función principal para depurar
async function debugRole() {
  console.log("🚀 Iniciando depuración de rol...");
  console.log("=" * 50);

  // Obtener la dirección desde los argumentos de línea de comandos
  const address = process.argv[2];

  if (!address) {
    console.error("❌ Error: Debes proporcionar una dirección de wallet");
    console.log("Uso: node debug-role.js <dirección_wallet>");
    console.log("Ejemplo: node debug-role.js 0x731476131c9497cd71c100f8342e65939bfb13e5");
    return;
  }

  console.log(`📍 Dirección a verificar: ${address}`);
  console.log("");

  // Verificar owner del contrato
  const owner = await getOwner();
  console.log("");

  // Verificar rol
  const roleInfo = await getRole(address);
  console.log("");

  // Verificar balance
  const balance = await getBalance(address);
  console.log("");

  // Resumen
  console.log("📊 RESUMEN:");
  console.log("=" * 50);
  console.log(`📍 Dirección: ${address}`);
  console.log(`👑 Owner del contrato: ${owner}`);
  console.log(`🎭 Rol: ${roleInfo?.roleName || "Error"} (${roleInfo?.roleNumber || "N/A"})`);
  console.log(`💰 Balance: ${balance} MTM`);

  // Verificar si la dirección es el owner
  if (owner && address.toLowerCase() === owner.toLowerCase()) {
    console.log("✅ Esta dirección es el owner del contrato");
  }

  console.log("=" * 50);
}

// Ejecutar la función principal
if (require.main === module) {
  debugRole().catch(console.error);
}

module.exports = {
  getRole,
  getBalance,
  getOwner,
  ContractRole
}; 