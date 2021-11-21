const Web3 = require("web3");
const cripter = require("./cripter");

const loggerController = require("./logger");

const eventojson = require("../contracts/artifacts/Evento.json");
const ticketjson = require("../contracts/artifacts/Ticket.json");

const ADDRESS_EVENTO = process.env.ADDRESS_EVENTO;
const ADDRESS_TICKET = process.env.ADDRESS_TICKET;

const log = loggerController.logger;
const bclog = loggerController.bclogger;

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.QUORUM_WS)
);
web3.eth.handleRevert = true; // Per ottenere le cause dei revert da parte della EVM
const eventInstance = new web3.eth.Contract(eventojson.abi, ADDRESS_EVENTO);
const ticketInstance = new web3.eth.Contract(ticketjson.abi, ADDRESS_TICKET);

exports.compraBiglietto = async (req, res) => {
  /* 
  Consente l'acquisto di un certo numero di biglietti 
  Richiede una richiesta inviata in POST con:
                                            [0]: numbiglietti
                                            [1]: id 
  Risponde con il render di index e l'esito dell'acquisto
  */
  session = req.session;
  const {
    numbiglietti,
    id
  } = req.body;
  let address = await cripter.decripta(session.blockchain_address);
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  var indexBigl = Array(numbiglietti-1);
  for await (let i of indexBigl) {
    try {
      var response = eventInstance.methods.compraBiglietto(id).send({
        from: address,
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(5000000),
      });
    } catch (error) {
      log.error(error);
      bclog.error(error + " With reason: " + error.reason);
      return res.render("index", {
        error: error.reason,
        logged: true,
      });
    }
  };
  try {
    var response_new = await eventInstance.methods.compraBiglietto(id).send({
      from: address,
      gasPrice: web3.utils.toHex(0),
      gasLimit: web3.utils.toHex(5000000),
    });
  } catch (error) {
    log.error(error);
    bclog.error(error + " With reason: " + error.reason);
    return res.render("index", {
      error: error.reason,
      logged: true,
    });
  }
  log.action(
    "ID :" + session.userid + " | Purchase of " + numbiglietti + " ticket/s succesful!"
  );
  let role = req.session.tempRole;
  delete req.session.tempRole;
  var isManager = false;
  var isBiglietteria = false;
  if (role == 1) {
    isManager = true;
  } else if (role == 2) {
    isBiglietteria = true;
  }
  return res.render("index", {
    message: "Biglietti acquistati correttamente",
    isManager: isManager,
    isBiglietteria: isBiglietteria,
    logged: true,
  });
};

exports.validaBiglietto = async (req, res) => {
  /*
  Consente la validazione di un biglietto per l'ingresso ad un evento (== STRAPPA)
  Richiede una richiesta inviata in POST con:
                                              [0]: idTicket
                                              [1]: idEvento
  Risponde con render di /validazione o /index con esito transazione
  */
  session = req.session;
  const {
    idTicket,
    idEvento
  } = req.body;
  let address = await cripter.decripta(session.blockchain_address);
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  try {
    var response = await eventInstance.methods
      .validaBiglietto(idTicket, idEvento)
      .send({
        from: address,
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(5000000),
      });
    log.action(
      "ID :" +
      session.userid +
      " | Validation of TICKET: " +
      idTicket +
      " succesful!"
    );
    return res.render("validazione", {
      message: "Biglietto validato correttamente",
      logged: true,
      isManager: true,
    });
  } catch (error) {
    log.error(error);
    bclog.error(error + " With reason: " + error.reason);
    res.render("index", {
      error: error.reason,
      logged: true,
      isManager: true,
    });
  }
};

exports.sigillaBiglietto = async (req, res) => {
  /*
  Consente l'apposizione di un sigillo fiscale al biglietto
  Richiede una richiesta inviata in POST con:
                                            [0]: idTicket
                                            [1]: idEvento
                                            [2]: sigillo
  Risponde con render di /sigillo o /index con esito transazione
  */
  session = req.session;
  const {
    idTicket,
    idEvento,
    sigillo
  } = req.body;
  let address = await cripter.decripta(session.blockchain_address);
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  try {
    var response = await eventInstance.methods
      .sigillaBiglietto(idTicket, idEvento, sigillo)
      .send({
        from: address,
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(5000000),
      });
    log.action(
      "ID :" +
      session.userid +
      " | Sealing of TICKET: " +
      idTicket +
      " succesful!"
    );
    return res.render("sigillo", {
      message: "Biglietto sigillato correttamente",
      logged: true,
      isBiglietteria: true,
    });
  } catch (error) {
    log.error(error);
    bclog.error(error + " With reason: " + error.reason);
    res.render("index", {
      error: error.reason,
      logged: true,
      isBiglietteria: true,
    });
  }
};

exports.inserisciEvento = async (req, res) => {
  /* 
  Consente di inserire un evento in blockchain
  Richiede una richiesta in POST con:
                                    [0]: name
                                    [1]: artista
                                    [2]: ntotbiglietti
                                    [3]: date
                                    [4]: descr
  Risponde con render di /eventi o /index con esito transazione
  */
  session = req.session;
  const {
    name,
    artista,
    ntotbiglietti,
    date,
    descr
  } = req.body;
  let address = await cripter.decripta(session.blockchain_address);
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  try {
    const response = await eventInstance.methods
      .creaEvento(name, date, descr, artista, ntotbiglietti)
      .send({
        from: address,
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(5000000),
      });
    log.action(
      "ID :" +
      session.userid +
      " | Event addition of EVENTO: " +
      name +
      " succesful!"
    );
    var events = await this.getEventi();
    return res.render("eventi", {
      events: events,
      message: "Evento inserito correttamente",
      logged: true,
      isManager: true,
    });
  } catch (error) {
    log.error(error);
    bclog.error(error + " With reason: " + error.reason);
    res.render("index", {
      error: error.reason,
      logged: true,
      isBiglietteria: true,
    });
  }
};

exports.modificaEvento = async (req, res) => {
  /* 
  Modifica un evento già inserito in blockchain
  Richiede una richiesta in POST con:
                                    [0]: name
                                    [1]: date
                                    [2]: descr
                                    [3]: artista
                                    [4]: ndispbiglietti (biglietti disponibili)
                                    [5]: id
  Risponde con render di /eventi o /index con esito transazione
  */
  session = req.session;
  let address = await cripter.decripta(session.blockchain_address);
  const {
    name,
    date,
    descr,
    artista,
    ndispbiglietti,
    id
  } = req.body;
  var nuovoproprietario = address; // Assegnazione evento solo a stesso proprietario
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  try {
    const response = await eventInstance.methods
      .modificaEvento(
        id,
        name,
        date,
        descr,
        artista,
        ndispbiglietti,
        nuovoproprietario
      )
      .send({
        from: address,
        gasPrice: web3.utils.toHex(0),
        gasLimit: web3.utils.toHex(5000000),
      });
    log.action(
      "ID :" +
      session.userid +
      " | Editing informations of EVENT: " +
      id +
      " succesful!"
    );
    var events = await this.getEventi();
    return res.render("eventi", {
      message: "Evento modificato correttamente",
      logged: true,
      isManager: true,
      events: events,
    });
  } catch (error) {
    res.render("index", {
      error: error.reason,
      logged: true,
      isManager: true,
    });
  }
};

exports.eliminaEvento = async (req, res) => {
  /*
  Elimina un evento già inserito.
  L'evento viene comunque conservato in blockchain, ma viene modificato il relativo campo events[i].exists.
  Richiede una richiesta in POST con:
                                    [0]: id (evento)
  Risponde con render di /eventi o /index con esito transazione
  */
  session = req.session;
  let address = await cripter.decripta(session.blockchain_address);
  const {
    id
  } = req.body;
  var unlock = await web3.eth.personal.unlockAccount(address, "", 600);
  try {
    const response = await eventInstance.methods.eliminaEvento(id).send({
      from: address,
      gasPrice: web3.utils.toHex(0),
      gasLimit: web3.utils.toHex(5000000),
    });
    log.action(
      "ID :" + session.userid + " | Deletion of EVENT: " + id + " succesful!"
    );
    var events = await this.getEventi();
    return res.render("eventi", {
      events: events,
      message: "Evento cancellato correttamente",
      logged: true,
      isManager: true,
    });
  } catch (error) {
    log.error(error);
    bclog.error(error + " With reason: " + error.reason);
    res.render("index", {
      error: error.reason,
      logged: true,
      isManager: true,
    });
  }
};

exports.getEventi = async () => {
  /*
  Genera un vettore contenente degli oggetti eventi in base agli eventi disponibili nella blockchain 
  */
  const eventsIndex = await eventInstance.methods.getEventsIndex().call();
  var events = new Array(eventsIndex);
  for (let i = 1; i <= eventsIndex; i++) {
    let evento = await this.getSingoloEvento(i - 1);
    events[i - 1] = evento;
  }
  log.info("Reading events from blockchain completed succesfully");
  return events;
};

exports.getSingoloEvento = async (idEvento) => {
  /*
  Genera un oggetto con i dati di un evento precedentemente inserito nella blockchain
  */
  const response = await eventInstance.methods
    .getSingoloEvento(idEvento)
    .call();

  const name = response["0"]; //Parsing risposte dalla blockchain
  const date = response["1"];
  const descr = response["2"];
  const artista = response["3"];
  const ntotbiglietti = response["4"];
  const ndispbiglietti = response["5"];
  //const proprietario = response["6"]; //Per privacy non viene fornito l'address del wallet del proprietario dell'evento
  const exists = response["7"];

  evento = {
    name: name,
    date: date,
    descr: descr,
    artista: artista,
    ntotbiglietti: ntotbiglietti,
    ndispbiglietti: ndispbiglietti,
    exists: exists,
    id: idEvento,
  };

  return evento;
};

exports.creaAccount = async () => {
  /*
  Genera un account wallet nel nodo predefinito della blockchain
  */
  var account = await web3.eth.personal.newAccount("", (err, string) => {
    if (err) {
      console.log(err);
      return res.render("index", {
        error: "Transazione non eseguita.",
        logged: true,
        isManager: true,
      });
    }
  });
  var lock = await web3.eth.personal.lockAccount(account, (err, result) => {
    if (err) {
      console.log(err);
      return res.render("index", {
        error: "Account non locked.",
        logged: true,
        isManager: true,
      });
    }
  });
  bclog.blockchain(
    "\tBLOCKCHAIN_EVENT: account_created \t\t| ACCOUNT: " +
    account +
    " created on local node"
  );
  log.info("New Account creation on local node completed");
  return account;
};

async function bigliettiPerUtente(address) {
  /*
  Ricava un vettore di biglietti posseduti da un utente
  */
  var response = await ticketInstance.methods
    .bigliettiPerUtente(address)
    .call();
  return response;
}

async function eventoDaBiglietto(idTicket) {
  /*
  A partire dall'id di un biglietto ricava l'evento relativo
  */
  var response = await ticketInstance.methods
    .eventoDaBiglietto(idTicket)
    .call();
  return response;
}

exports.bigliettiUtente = async (address) => {
  /*
  Restituisce vettore di oggetti biglietti con relativo evento
  */
  var tickets = await bigliettiPerUtente(address);
  var idEventi = new Array(tickets.length);
  var eventi = new Array(tickets.length);

  log.info("User's ticket reading requested");

  for (let i = 0; i < tickets.length; i++) {
    idEventi[i] = await eventoDaBiglietto(tickets[i]);
    let evento = await this.getSingoloEvento(idEventi[i]);
    eventi[i] = {
      idTicket: tickets[i],
      eventId: idEventi[i],
      name: evento.name,
      artista: evento.artista,
      date: evento.date,
      descr: evento.descr,
      exists: evento.exists,
    };
  }
  return eventi;
};

/**
 * Definizioni Listeners per logging blockchain events
 */

var evento_creato = eventInstance.events.evento_creato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t\t| ADDRESS: " +
        eventObj.returnValues._user +
        " created EVENTID: " +
        eventObj.returnValues._eventId +
        " with EVENTNAME: " +
        eventObj.returnValues._nome
      );
    }
  }
);
var evento_modificato = eventInstance.events.evento_modificato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| ADDRESS: " +
        eventObj.returnValues._user +
        " modified EVENTID: " +
        eventObj.returnValues._eventId +
        " with EVENTNAME: " +
        eventObj.returnValues._nome
      );
    }
  }
);
var evento_eliminato = eventInstance.events.evento_eliminato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t\t| ADDRESS: " +
        eventObj.returnValues._user +
        " deleted EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);

var biglietto_acquistato = eventInstance.events.biglietto_acquistato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| ADDRESS: " +
        eventObj.returnValues._user +
        " purchased TICKETID: " +
        eventObj.returnValues._ticketId +
        " for EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);
var biglietto_sigillato = eventInstance.events.biglietto_sigillato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| ADDRESS: " +
        eventObj.returnValues._user +
        " sealed TICKETID: " +
        eventObj.returnValues._ticketId +
        " for EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);
var biglietto_validato = eventInstance.events.biglietto_validato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.event_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| ADDRESS: " +
        eventObj.returnValues._user +
        " validated TICKETID: " +
        eventObj.returnValues._ticketId +
        " for EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);

var biglietto_acquistato = ticketInstance.events.biglietto_acquistato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.ticket_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| TICKETID: " +
        eventObj.returnValues._ticketId +
        " purchased for EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);
var biglietto_sigillato = ticketInstance.events.biglietto_sigillato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.ticket_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| TICKETID: " +
        eventObj.returnValues._ticketId +
        " sealed with SEAL: " +
        eventObj.returnValues._seal
      );
    }
  }
);
var biglietto_validato = ticketInstance.events.biglietto_validato({},
  (error, eventObj) => {
    if (error) {
      bclog.error(error);
    }
    if (eventObj) {
      bclog.ticket_contract(
        "BLOCKCHAIN_EVENT: " +
        eventObj.event +
        " \t| TICKETID: " +
        eventObj.returnValues._ticketId +
        " validated for EVENTID: " +
        eventObj.returnValues._eventId
      );
    }
  }
);