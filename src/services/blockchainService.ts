import { ethers } from "ethers";

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
  "function redeemTokens(string memory benefit) external",
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
export enum ContractRole {
  None = 0,
  Estudiante = 1,
  Docente = 2,
  Admin = 3
}

export interface OfertaTutoria {
  tutor: string;
  materia: string;
  precio: number;
  activa: boolean;
  timestamp: number;
  id?: number;
}

export interface Tutoria {
  estudiante: string;
  tutor: string;
  materia: string;
  tokens: number;
  timestamp: number;
}

// Función auxiliar para manejar errores de ethers.js
function getReadableErrorMessage(error: any): string {
  if (error.reason) {
    return error.reason;
  }
  if (error.data?.message) {
    return error.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "Ocurrió un error desconocido.";
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  private _getProvider(): ethers.BrowserProvider {
    if (!window.ethereum) {
      throw new Error("MetaMask no está instalado.");
    }
    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
    return this.provider;
  }

  private async _getContract(withSigner = false): Promise<ethers.Contract> {
    const provider = this._getProvider();
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, signer);
    }
    return new ethers.Contract(CONTRACT_ADDRESS, MENTORIUM_ABI, provider);
  }

  // Conectar a MetaMask
  async connectWallet(): Promise<{ address: string; balance: number }> {
    try {
      // Verificar si MetaMask está instalado
      if (!window.ethereum) {
        throw new Error(
          "MetaMask no está instalado. Por favor, instala MetaMask para continuar."
        );
      }

      // Solicitar conexión de cuentas
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No se pudo conectar a MetaMask");
      }

      const address = accounts[0];

      this.provider = this._getProvider();
      this.signer = await this.provider.getSigner();
      this.contract = await this._getContract(true);

      // Obtener balance de tokens
      const balance = await this.getTokenBalance(address);

      return { address, balance };
    } catch (error) {
      console.error("Error al conectar wallet:", error);
      throw error;
    }
  }

  // Obtener balance de tokens de una dirección
  async getTokenBalance(address: string): Promise<number> {
    try {
      const contract = await this._getContract();
      console.log("Consultando balance para dirección:", address);
      const balance = await contract.getBalance(address);
      const balanceNumber = Number(balance);
      console.log("Balance obtenido:", balanceNumber);
      return balanceNumber;
    } catch (error) {
      console.error("Error al obtener balance:", error);
      return 0;
    }
  }

  // Obtener rol de una dirección
  async getRole(address: string): Promise<ContractRole> {
    try {
      const contract = await this._getContract();
      const role = await contract.roles(address);
      const roleNumber = Number(role);
      console.log("Rol obtenido para", address, ":", roleNumber);
      return roleNumber as ContractRole;
    } catch (error) {
      console.error("Error al obtener rol:", error);
      return ContractRole.None;
    }
  }

  // Asignar tokens (solo docentes)
  async assignTokens(to: string, amount: number): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.assignTokens(to, amount);
      await tx.wait();
      console.log("Tokens asignados exitosamente:", amount, "a", to);
    } catch (error) {
      console.error("Error al asignar tokens:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Crear oferta de tutoría (solo estudiantes)
  async crearOfertaTutoria(materia: string, precio: number): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.crearOfertaTutoria(materia, precio);
      await tx.wait();
      console.log("Oferta creada exitosamente:", materia, "por", precio, "MTM");
    } catch (error) {
      console.error("Error al crear oferta:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Cancelar oferta de tutoría
  async cancelarOfertaTutoria(ofertaId: number): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.cancelarOfertaTutoria(ofertaId);
      await tx.wait();
      console.log("Oferta cancelada exitosamente:", ofertaId);
    } catch (error) {
      console.error("Error al cancelar oferta:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Solicitar tutoría (solo estudiantes)
  async requestTutoring(ofertaId: number): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.requestTutoring(ofertaId);
      await tx.wait();
      console.log("Tutoría solicitada exitosamente:", ofertaId);
    } catch (error) {
      console.error("Error al solicitar tutoría:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Canjear tokens (cualquier usuario con tokens)
  async redeemTokens(benefit: string): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.redeemTokens(benefit);
      await tx.wait();
      console.log("Tokens canjeados exitosamente por:", benefit);
    } catch (error) {
      console.error("Error al canjear tokens:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Obtener todas las ofertas activas
  async getOfertasActivas(): Promise<OfertaTutoria[]> {
    try {
      const contract = await this._getContract();
      const ofertas = await contract.getOfertasActivas();
      console.log("Ofertas obtenidas del contrato:", ofertas.length);

      const ofertasFiltradas = ofertas
        .map((oferta: any, index: number) => ({
          id: index,
          tutor: oferta.tutor,
          materia: oferta.materia,
          precio: Number(oferta.precio),
          activa: oferta.activa,
          timestamp: Number(oferta.timestamp),
        }))
        .filter((oferta: OfertaTutoria) => oferta.activa);

      console.log("Ofertas activas filtradas:", ofertasFiltradas.length);
      return ofertasFiltradas;
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
      return [];
    }
  }

  // Obtener todas las tutorías
  async getTutorias(): Promise<Tutoria[]> {
    try {
      const contract = await this._getContract();
      const tutorias = await contract.getTutorias();
      return tutorias.map((tutoria: any) => ({
        estudiante: tutoria.estudiante,
        tutor: tutoria.tutor,
        materia: tutoria.materia,
        tokens: Number(tutoria.tokens),
        timestamp: Number(tutoria.timestamp),
      }));
    } catch (error) {
      console.error("Error al obtener tutorías:", error);
      return [];
    }
  }

  // Obtener ofertas de un tutor específico
  async getOfertasPorTutor(tutor: string): Promise<number[]> {
    try {
      const contract = await this._getContract();
      return await contract.getOfertasPorTutor(tutor);
    } catch (error) {
      console.error("Error al obtener ofertas del tutor:", error);
      return [];
    }
  }

  // Obtener información de una oferta específica
  async getOferta(ofertaId: number): Promise<OfertaTutoria | null> {
    try {
      const contract = await this._getContract();
      const oferta = await contract.getOferta(ofertaId);
      return {
        id: ofertaId,
        tutor: oferta.tutor,
        materia: oferta.materia,
        precio: Number(oferta.precio),
        activa: oferta.activa,
        timestamp: Number(oferta.timestamp),
      };
    } catch (error) {
      console.error("Error al obtener oferta:", error);
      return null;
    }
  }

  // Establecer rol (solo owner)
  async setRole(user: string, roleIndex: number): Promise<void> {
    try {
      const contract = await this._getContract(true);
      const tx = await contract.setRole(user, roleIndex);
      await tx.wait();
      console.log("Rol establecido exitosamente:", roleIndex, "para", user);
    } catch (error) {
      console.error("Error al establecer rol:", error);
      throw new Error(getReadableErrorMessage(error));
    }
  }

  // Escuchar eventos del contrato
  onTokensAssigned(callback: (to: string, amount: number) => void) {
    this._getContract().then((contract) => {
      contract.on("TokensAssigned", (to, amount) => {
        callback(to, Number(amount));
      });
    });
  }

  onOfertaCreada(
    callback: (tutor: string, materia: string, precio: number) => void
  ) {
    this._getContract().then((contract) => {
      contract.on("OfertaCreada", (tutor, materia, precio) => {
        callback(tutor, materia, Number(precio));
      });
    });
  }

  onOfertaCancelada(callback: (tutor: string, ofertaId: number) => void) {
    this._getContract().then((contract) => {
      contract.on("OfertaCancelada", (tutor, ofertaId) => {
        callback(tutor, Number(ofertaId));
      });
    });
  }

  onTutoringPaid(
    callback: (
      from: string,
      to: string,
      amount: number,
      materia: string
    ) => void
  ) {
    this._getContract().then((contract) => {
      contract.on("TutoringPaid", (from, to, amount, materia) => {
        callback(from, to, Number(amount), materia);
      });
    });
  }

  onTokensRedeemed(callback: (user: string, benefit: string) => void) {
    this._getContract().then((contract) => {
      contract.on("TokensRedeemed", (user, benefit) => {
        callback(user, benefit);
      });
    });
  }

  // Limpiar listeners
  async removeAllListeners() {
    try {
      const contract = await this._getContract();
      contract.removeAllListeners();
      console.log("Todos los listeners del contrato han sido eliminados.");
    } catch (error) {
      console.error("Error al eliminar listeners:", error);
    }
  }
}

// Instancia singleton
export const blockchainService = new BlockchainService();

// Extender Window para TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
