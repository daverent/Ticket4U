// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./Ticket.sol";

// ESEGUIRE PRIMA IL DEPLOY DI QUESTO CONTRATTO PRIMA DI Evento.sol

contract Evento{
    
    address public ticketContractAddress;
    
    struct EventData {
        string nome;
        string data;
        string descr;
        string artista;
        uint24 totali;
        uint24 disponibili;
        address proprietario;
        bool exists;
    }
    
    EventData[] public events;
    
    constructor(address _ticketContractAddress){
        ticketContractAddress = _ticketContractAddress;
        Ticket ticketContract = Ticket(ticketContractAddress);
        ticketContract.connect(msg.sender);
    }

    event evento_creato(address _user, uint256 _eventId, string _nome);
    event evento_modificato(address _user, uint256 _eventId, string _nome);
    event evento_eliminato(address _user, uint256 _eventId);

    event biglietto_acquistato(address _user, uint256 _ticketId, uint256 _eventId);
    event biglietto_sigillato(address _user, uint256 _ticketId, uint256 _eventId);
    event biglietto_validato(address _user, uint256 _ticketId, uint256 _eventId);

    function creaEvento(string memory _nome,
                        string memory _data,
                        string memory _descr,
                        string memory _artista,
                        uint24 _totali) external returns (uint256) {
        events.push(EventData(_nome, _data, _descr, _artista, _totali, _totali, msg.sender, true));
        uint256 id = events.length - 1;

        emit evento_creato(msg.sender, id, _nome);
        return id;
    }
    
    function modificaEvento(uint256 id, 
                            string memory _nome, 
                            string memory _data,
                            string memory _descr,
                            string memory _artista, 
                            uint24 _disponibili, 
                            address _proprietario) external returns (uint256) {
        require(events.length > id, "L'evento non esiste!");
        require(events[id].proprietario == msg.sender, "Solo il proprietario orginale puo' modificare un evento!");
        events[id].nome = _nome;
        events[id].data = _data;
        events[id].descr = _descr;
        events[id].artista = _artista;
        events[id].disponibili = _disponibili;
        events[id].proprietario = _proprietario;
        
        emit evento_modificato(msg.sender, id, _nome);
        return id;
    }
    
    function bigliettiRimanenti(uint256 _eventId) public view returns (uint24) {
        return events[_eventId].disponibili;
    }
    
    function compraBiglietto(uint256 _eventId) external returns (uint256) {
        require(events.length > _eventId, "L'evento non esiste!");
        require(events[_eventId].proprietario != address(0), "L'evento non esiste!");
        require(events[_eventId].exists, "L'evento e' stato cancellato precedentemente!");
        require(events[_eventId].disponibili > uint24(0), "Non ci sono biglietti disponibili!");
        
        Ticket ticketContract = Ticket(ticketContractAddress);
        uint256 ticketId = ticketContract.compra(msg.sender, _eventId);
        
        events[_eventId].disponibili--;
        
        emit biglietto_acquistato(msg.sender, ticketId, _eventId);
        return ticketId;
    }
    
    function validaBiglietto(uint256 _ticketId, uint256 _eventId) external {
        require(events.length > _eventId, "L'evento non esiste.");
        require(events[_eventId].proprietario != address(0), "L'evento non esiste!");
        require(events[_eventId].exists, "L'evento e' stato cancellato precedentemente!");
        require(events[_eventId].proprietario == msg.sender, "Solo il gestore dell'evento puo' validare il biglietto!");
        
        Ticket ticketContract = Ticket(ticketContractAddress);
        
        ticketContract.valida(_eventId, _ticketId);
        
        emit biglietto_validato(msg.sender, _ticketId, _eventId);
    }
    
    function sigillaBiglietto(uint256 _ticketId, uint256 _eventId, uint256 _sigillo) external {
        require(events.length > _eventId, "L'evento non esiste!");
        require(events[_eventId].proprietario != address(0), "L'evento non esiste!");
        require(events[_eventId].exists, "L'evento e' stato cancellato precedentemente!");

        Ticket ticketContract = Ticket(ticketContractAddress);
        
        ticketContract.sigilla(_ticketId, _sigillo);
        
        emit biglietto_sigillato(msg.sender, _ticketId, _eventId);
    }

    function getSingoloEvento(uint256 _eventId) view external returns (EventData memory) {
        require(events.length > _eventId, "L'evento non esiste!");
        return (events[_eventId]);
    }
    
    
    function getEventsIndex() view external returns (uint) {
        return events.length;
    }

    function eliminaEvento(uint256 _eventId) external {
                require(events.length > _eventId, "L'evento non esiste!");
                require(events.length != 0, "L'evento non esiste!");
                require(events.length >= _eventId, "L'evento non esiste!");
                require(events[_eventId].proprietario == msg.sender, "Solo il gestore dell'evento puo' eliminarlo!");

                events[_eventId].exists = false;
                
                emit evento_eliminato(msg.sender, _eventId);
    }
}