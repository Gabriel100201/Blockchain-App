// Licencia estándar para contratos de código abierto
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Definimos el contrato principal
contract MentoriumToken {
    address public owner; // Dirección del creador del contrato

    // Definición de roles posibles dentro del sistema
    enum Role { None, Docente, EstudianteConDificultad, Tutor }

    // Mapeo de direcciones a sus roles
    mapping(address => Role) public roles;

    // Mapeo de direcciones a sus saldos de tokens
    mapping(address => uint) public balances;

    // Estructura que representa una tutoría realizada
    struct Tutoria {
        address estudiante;
        address tutor;
        uint tokens;
        uint timestamp;
    }

    // Lista de todas las tutorías registradas
    Tutoria[] public tutorias;

    // Eventos que el contrato emitirá cuando ocurran acciones relevantes
    event TokensAssigned(address indexed to, uint amount);
    event TutoringPaid(address indexed from, address indexed to, uint amount);
    event TokensRedeemed(address indexed user, string benefit);

    // Restricción: solo el owner puede ejecutar funciones con este modificador
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto.");
        _;
    }

    // Restricción: solo docentes pueden ejecutar
    modifier onlyDocente() {
        require(roles[msg.sender] == Role.Docente, "Solo docentes pueden ejecutar esto.");
        _;
    }

    // Restricción: solo tutores pueden ejecutar
    modifier onlyTutor() {
        require(roles[msg.sender] == Role.Tutor, "Solo tutores pueden canjear tokens.");
        _;
    }

    // Constructor: el creador del contrato es también un docente
    constructor() {
        owner = msg.sender;
        roles[owner] = Role.Docente;
    }

    // Permite al owner asignar roles a otros usuarios
    function setRole(address user, uint roleIndex) external onlyOwner {
        require(roleIndex <= uint(Role.Tutor), "Rol no valido.");
        roles[user] = Role(roleIndex);
    }

    // Permite a un docente asignar tokens a un estudiante
    function assignTokens(address to, uint amount) external onlyDocente {
        balances[to] += amount;
        emit TokensAssigned(to, amount);
    }

    // El estudiante paga tokens a un tutor para solicitar una tutoría
    function requestTutoring(address tutor, uint amount) external {
        require(roles[tutor] == Role.Tutor, "El destino debe ser tutor.");
        require(balances[msg.sender] >= amount, "Saldo insuficiente.");

        // Transferencia de tokens
        balances[msg.sender] -= amount;
        balances[tutor] += amount;

        // Registro de la tutoría
        tutorias.push(Tutoria({
            estudiante: msg.sender,
            tutor: tutor,
            tokens: amount,
            timestamp: block.timestamp
        }));

        emit TutoringPaid(msg.sender, tutor, amount);
    }

    // El tutor puede canjear sus tokens por un beneficio (ejemplo simbólico)
    function redeemTokens(string memory benefit) external onlyTutor {
        require(balances[msg.sender] > 0, "No hay tokens para canjear.");

        // Quemar tokens (o simularlo)
        balances[msg.sender] = 0;

        emit TokensRedeemed(msg.sender, benefit);
    }

    // Función pública para consultar el saldo de cualquier usuario
    function getBalance(address user) external view returns (uint) {
        return balances[user];
    }

    // Devuelve todas las tutorías registradas
    function getTutorias() external view returns (Tutoria[] memory) {
        return tutorias;
    }
}
