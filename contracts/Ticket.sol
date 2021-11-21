// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

// ESEGUIRE PRIMA IL DEPLOY DEL CONTRATTO Ticket.sol

contract Ticket {
    address public eventContractAddress;
    bool connected;

    struct TicketData {
        uint256 eventId;
        uint256 sigillo;
        bool validato;
    }

    TicketData[] public tickets;
    mapping(address => uint256[]) public ownedTokens;

    modifier connectedEvent() {
        require(connected);
        _;
    }

    constructor() {
        eventContractAddress = address(0);
        connected = false;
    }

    event biglietto_acquistato(
        uint256 _ticketId,
        uint256 _eventId
    );
    event biglietto_sigillato(
        uint256 _ticketId,
        uint256 _seal
    );
    event biglietto_validato(
        uint256 _ticketId,
        uint256 _eventId
    );

    function connect(address _eventContractAddress) external {
        eventContractAddress = _eventContractAddress;
        connected = true;
    }

    function validabile(uint256 _eventId, uint256 _ticketId)
        public
        view
        returns (bool)
    {
        require(_ticketId < tickets.length, "Biglietto non esistente!");
        require(tickets[_ticketId].eventId == _eventId, "Codice biglietto errato!");
        require(tickets[_ticketId].validato == false, "Biglietto gia' validato!");
        require(
            tickets[_ticketId].sigillo != uint256(0),
            "Il biglietto deve essere prima sigillato da una biglietteria!"
        );

        return true;
    }

    function valida(uint256 _eventId, uint256 _ticketId)
        external
        connectedEvent
        returns (bool)
    {
        require(
            validabile(_eventId, _ticketId),
            "Il biglietto non e' validabile!"
        );
        tickets[_ticketId].validato = true;
        
        emit biglietto_validato(_ticketId, _eventId);
        return tickets[_ticketId].validato;
    }

    function compra(address buyer, uint256 eventId)
        external
        connectedEvent
        returns (uint256)
    {
        require(acquistabile(buyer, eventId), "Hai gia' acquistato il numero massimo di biglietti per questo evento!");
        tickets.push(TicketData(eventId, 0, false));
        uint256 id = tickets.length - 1;

        ownedTokens[buyer].push(id);
        
        emit biglietto_acquistato(id, eventId);
        return id;
    }
    
    function acquistabile(address buyer, uint256 eventId) internal view returns (bool) {
        uint256 ticketNumber = 0;
        uint256[] memory userTickets = bigliettiPerUtente(buyer);
        for (uint i; i < userTickets.length; i++) {
            if(tickets[userTickets[i]].eventId == eventId){ 
                ticketNumber++; 
            }
        }
        if (ticketNumber < 5) {
            return true;
        } else {
            return false;
        }
    }

    function sigilla(uint256 _ticketId, uint256 _sigillo)
        external
        connectedEvent
        returns (bool)
    {
        require(_ticketId < tickets.length, "Biglietto non esistente!");
        require(
            tickets[_ticketId].sigillo == uint256(0),
            "Ticket gia' con sigillo fiscale!"
        );
        tickets[_ticketId].sigillo = _sigillo;
        
        emit biglietto_sigillato(_ticketId, _sigillo);
        return true;
    }

    function bigliettiPerUtente(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return ownedTokens[_owner];
    }

    function eventoDaBiglietto(uint256 _idTicket)
        public
        view
        returns (uint256)
    {
        require(_idTicket < tickets.length, "Biglietto non esistente!");
        return tickets[_idTicket].eventId;
    }
}
