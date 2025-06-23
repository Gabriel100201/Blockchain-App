import { ethers } from "ethers";

// ABI del contrato Mentorium (extraído del smart contract)
const MENTORIUM_ABI = [
  "function owner() view returns (address)",
  "function roles(address) view returns (uint8)",
  "function balances(address) view returns (uint256)",
  "function tutorias(uint256) view returns (address estudiante, address tutor, uint256 tokens, uint256 timestamp)",
  "function setRole(address user, uint256 roleIndex) external",
  "function assignTokens(address to, uint256 amount) external",
  "function requestTutoring(address tutor, uint256 amount) external",
  "function redeemTokens(string memory benefit) external",
  "function getBalance(address user) view returns (uint256)",
  "function getTutorias() view returns (tuple(address estudiante, address tutor, uint256 tokens, uint256 timestamp)[])",
  "event TokensAssigned(address indexed to, uint256 amount)",
  "event TutoringPaid(address indexed from, address indexed to, uint256 amount)",
  "event TokensRedeemed(address indexed user, string benefit)",
];

// Dirección del contrato desplegado
const CONTRACT_ADDRESS = "0xb0F8f553de2B98448e66Bd7040Ae430a313Ce9A1";

// Roles del smart contract
export enum ContractRole {
  None = 0,
  Docente = 1,
  EstudianteConDificultad = 2,
  Tutor = 3,
}

export interface Tutoria {
  estudiante: string;
  tutor: string;
  tokens: number;
  timestamp: number;
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

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

      // Crear provider y signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Crear instancia del contrato
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MENTORIUM_ABI,
        this.signer
      );

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
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const balance = await this.contract.getBalance(address);
      return Number(balance);
    } catch (error) {
      console.error("Error al obtener balance:", error);
      return 0;
    }
  }

  // Obtener rol de una dirección
  async getRole(address: string): Promise<ContractRole> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const role = await this.contract.roles(address);
      return Number(role) as ContractRole;
    } catch (error) {
      console.error("Error al obtener rol:", error);
      return ContractRole.None;
    }
  }

  // Asignar tokens (solo docentes)
  async assignTokens(to: string, amount: number): Promise<void> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const tx = await this.contract.assignTokens(to, amount);
      await tx.wait();
    } catch (error) {
      console.error("Error al asignar tokens:", error);
      throw new Error(
        "Error al asignar tokens. Verifica que tengas permisos de docente."
      );
    }
  }

  // Solicitar tutoría
  async requestTutoring(tutor: string, amount: number): Promise<void> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const tx = await this.contract.requestTutoring(tutor, amount);
      await tx.wait();
    } catch (error) {
      console.error("Error al solicitar tutoría:", error);
      throw new Error(
        "Error al solicitar tutoría. Verifica tu saldo y que el tutor sea válido."
      );
    }
  }

  // Canjear tokens (solo tutores)
  async redeemTokens(benefit: string): Promise<void> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const tx = await this.contract.redeemTokens(benefit);
      await tx.wait();
    } catch (error) {
      console.error("Error al canjear tokens:", error);
      throw new Error(
        "Error al canjear tokens. Verifica que seas tutor y tengas tokens."
      );
    }
  }

  // Obtener todas las tutorías
  async getTutorias(): Promise<Tutoria[]> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const tutorias = await this.contract.getTutorias();
      return tutorias.map((tutoria: any) => ({
        estudiante: tutoria.estudiante,
        tutor: tutoria.tutor,
        tokens: Number(tutoria.tokens),
        timestamp: Number(tutoria.timestamp),
      }));
    } catch (error) {
      console.error("Error al obtener tutorías:", error);
      return [];
    }
  }

  // Establecer rol (solo owner)
  async setRole(user: string, roleIndex: number): Promise<void> {
    if (!this.contract) {
      throw new Error("Contrato no inicializado");
    }

    try {
      const tx = await this.contract.setRole(user, roleIndex);
      await tx.wait();
    } catch (error) {
      console.error("Error al establecer rol:", error);
      throw new Error(
        "Error al establecer rol. Solo el owner puede hacer esto."
      );
    }
  }

  // Escuchar eventos del contrato
  onTokensAssigned(callback: (to: string, amount: number) => void) {
    if (!this.contract) return;

    this.contract.on("TokensAssigned", (to: string, amount: any) => {
      callback(to, Number(amount));
    });
  }

  onTutoringPaid(callback: (from: string, to: string, amount: number) => void) {
    if (!this.contract) return;

    this.contract.on(
      "TutoringPaid",
      (from: string, to: string, amount: any) => {
        callback(from, to, Number(amount));
      }
    );
  }

  onTokensRedeemed(callback: (user: string, benefit: string) => void) {
    if (!this.contract) return;

    this.contract.on("TokensRedeemed", (user: string, benefit: string) => {
      callback(user, benefit);
    });
  }

  // Limpiar listeners
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
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
