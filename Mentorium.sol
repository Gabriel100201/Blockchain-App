// Licencia estándar para contratos de código abierto
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Definimos el contrato principal
contract MentoriumToken {
    address public owner; // Dirección del creador del contrato

    // Definición de roles posibles dentro del sistema
    enum Role { 
        None,       // Sin rol asignado
        Estudiante, // Puede dar y recibir tutorías
        Docente,    // Puede asignar tokens iniciales
        Admin       // Gestión del sistema
    }

    // Mapeo de direcciones a sus roles
    mapping(address => Role) public roles;

    // Mapeo de direcciones a sus saldos de tokens
    mapping(address => uint) public balances;

    // Estructura que representa una oferta de tutoría
    struct OfertaTutoria {
        address tutor;
        string materia;
        uint precio;
        bool activa;
        uint timestamp;
    }

    // Estructura que representa una tutoría realizada
    struct Tutoria {
        address estudiante;
        address tutor;
        string materia;
        uint tokens;
        uint timestamp;
    }

    // Lista de ofertas de tutorías disponibles
    OfertaTutoria[] public ofertasTutoria;

    // Lista de todas las tutorías registradas
    Tutoria[] public tutorias;

    // Mapeo de direcciones a sus ofertas activas
    mapping(address => uint[]) public ofertasPorTutor;

    // Eventos que el contrato emitirá cuando ocurran acciones relevantes
    event TokensAssigned(address indexed to, uint amount);
    event OfertaCreada(address indexed tutor, string materia, uint precio);
    event OfertaCancelada(address indexed tutor, uint ofertaId);
    event TutoringPaid(address indexed from, address indexed to, uint amount, string materia);
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

    // Restricción: solo estudiantes pueden ejecutar
    modifier onlyEstudiante() {
        require(roles[msg.sender] == Role.Estudiante, "Solo estudiantes pueden ejecutar esto.");
        _;
    }

    // Restricción: solo admin puede ejecutar
    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Solo admin puede ejecutar esto.");
        _;
    }

    // Constructor: el creador del contrato es también admin y docente
    constructor() {
        owner = msg.sender;
        roles[owner] = Role.Admin;
    }

    // Permite al owner asignar roles a otros usuarios
    function setRole(address user, uint roleIndex) external onlyOwner {
        require(roleIndex <= uint(Role.Admin), "Rol no valido.");
        roles[user] = Role(roleIndex);
    }

    // Permite a un docente asignar tokens a un estudiante
    function assignTokens(address to, uint amount) external onlyDocente {
        require(roles[to] == Role.Estudiante, "Solo se pueden asignar tokens a estudiantes.");
        balances[to] += amount;
        emit TokensAssigned(to, amount);
    }

    // Un estudiante puede crear una oferta de tutoría
    function crearOfertaTutoria(string memory materia, uint precio) external onlyEstudiante {
        require(precio > 0, "El precio debe ser mayor a 0.");
        
        uint ofertaId = ofertasTutoria.length;
        ofertasTutoria.push(OfertaTutoria({
            tutor: msg.sender,
            materia: materia,
            precio: precio,
            activa: true,
            timestamp: block.timestamp
        }));

        ofertasPorTutor[msg.sender].push(ofertaId);
        emit OfertaCreada(msg.sender, materia, precio);
    }

    // Un estudiante puede cancelar su oferta de tutoría
    function cancelarOfertaTutoria(uint ofertaId) external {
        require(ofertaId < ofertasTutoria.length, "Oferta no existe.");
        require(ofertasTutoria[ofertaId].tutor == msg.sender, "Solo puedes cancelar tus ofertas.");
        require(ofertasTutoria[ofertaId].activa, "La oferta ya no esta activa.");

        ofertasTutoria[ofertaId].activa = false;
        emit OfertaCancelada(msg.sender, ofertaId);
    }

    // Un estudiante puede solicitar una tutoría a otro estudiante
    function requestTutoring(uint ofertaId) external onlyEstudiante {
        require(ofertaId < ofertasTutoria.length, "Oferta no existe.");
        require(ofertasTutoria[ofertaId].activa, "La oferta no esta activa.");
        require(ofertasTutoria[ofertaId].tutor != msg.sender, "No puedes solicitar tutoria a ti mismo.");
        require(roles[ofertasTutoria[ofertaId].tutor] == Role.Estudiante, "El tutor debe ser estudiante.");
        require(balances[msg.sender] >= ofertasTutoria[ofertaId].precio, "Saldo insuficiente.");

        address tutor = ofertasTutoria[ofertaId].tutor;
        uint precio = ofertasTutoria[ofertaId].precio;
        string memory materia = ofertasTutoria[ofertaId].materia;

        // Transferencia de tokens
        balances[msg.sender] -= precio;
        balances[tutor] += precio;

        // Registrar la tutoría
        tutorias.push(Tutoria({
            estudiante: msg.sender,
            tutor: tutor,
            materia: materia,
            tokens: precio,
            timestamp: block.timestamp
        }));

        // Desactivar la oferta (opcional, se puede mantener activa para futuras tutorías)
        // ofertasTutoria[ofertaId].activa = false;

        emit TutoringPaid(msg.sender, tutor, precio, materia);
    }

    // Cualquier usuario con tokens puede canjearlos por beneficios
    function redeemTokens(string memory benefit) external {
        require(balances[msg.sender] > 0, "No hay tokens para canjear.");

        // Quemar tokens (o simularlo)
        balances[msg.sender] = 0;

        emit TokensRedeemed(msg.sender, benefit);
    }

    // Función pública para consultar el saldo de cualquier usuario
    function getBalance(address user) external view returns (uint) {
        return balances[user];
    }

    // Devuelve el número total de ofertas
    function getNumeroOfertas() external view returns (uint) {
        return ofertasTutoria.length;
    }

    // Devuelve todas las ofertas (simplificado para evitar problemas de gas)
    function getOfertasActivas() external view returns (OfertaTutoria[] memory) {
        return ofertasTutoria;
    }

    // Devuelve todas las tutorías registradas
    function getTutorias() external view returns (Tutoria[] memory) {
        return tutorias;
    }

    // Devuelve las ofertas de un tutor específico
    function getOfertasPorTutor(address tutor) external view returns (uint[] memory) {
        return ofertasPorTutor[tutor];
    }

    // Función para obtener información de una oferta específica
    function getOferta(uint ofertaId) external view returns (OfertaTutoria memory) {
        require(ofertaId < ofertasTutoria.length, "Oferta no existe.");
        return ofertasTutoria[ofertaId];
    }
}
