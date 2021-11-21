const mysql = require("mysql");
const blockchainController = require("./blockchain");
const cripter = require("./cripter");

const logger = require("./logger");
log = logger.logger;

// *** Inizializzazione DB ***
var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// *** Gestione pagina Home ***
exports.home = async (req, res) => {
  session = req.session;
  var events = await blockchainController.getEventi();

  function compare(a, b) {
    if (a.ndispbiglietti > b.ndispbiglietti) {
      return -1;
    }
    if (a.ndispbiglietti < b.ndispbiglietti) {
      return 1;
    }
    return 0;
  }
  events.sort(compare);
  var eventsSorted = [];
  for (i = 0; i < 2; i++) {
    eventsSorted.push(events[i]);
  }

  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @home");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isManager = false;
          var isBiglietteria = false;
          if (role == 1) {
            isManager = true;
          } else if (role == 2) {
            isBiglietteria = true;
          }
          res.render("index", {
            eventsSorted: eventsSorted,
            isManager: isManager,
            isBiglietteria: isBiglietteria,
            logged: true,
          });
        }
      }
    );
  } else {
    log.info("ID: UNLOGGED | Visiting @home");
    res.render("index");
  }
};

// *** Gestione pagina Eventi ***
exports.eventi = async (req, res) => {
  session = req.session;
  var events = await blockchainController.getEventi();
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @eventi");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isManager = false;
          var isBiglietteria = false;
          if (role == 1) {
            isManager = true;
            res.render("eventi", {
              isManager: isManager,
              events: events,
              logged: true,
            });
          }
          if (role == 2) {
            isBiglietteria = true;
            res.render("eventi", {
              isBiglietteria: isBiglietteria,
              events: events,
              logged: true,
            });
          }
          if (role == 0) {
            res.render("eventi", {
              events: events,
              logged: true,
            });
          }
        }
      }
    );
  } else {
    log.info("ID: UNLOGGED | Visiting @eventi");
    res.render("eventi", {
      events: events,
      logged: false,
    });
  }
};

// *** Gestione pagina InserisciEventi ***
exports.inserisciEventi = (req, res) => {
  session = req.session;
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @insericiEventi");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isManager = false;
          if (role == 1) {
            isManager = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          res.render("inserisciEventi", {
            isManager: isManager,
            logged: true,
          });
        }
      }
    );
  } else {
    res.render("index", {
      protectionMessage: "Funzionalità non permessa",
    });
  }
};

// *** Gestione pagina ModificaEvento ***
exports.modificaEvento = async (req, res) => {
  session = req.session;
  const { id } = req.body;
  var evento = await blockchainController.getSingoloEvento(id);
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @modificaEvento");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isManager = false;
          if (role == 1) {
            isManager = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          res.render("modificaEvento", {
            isManager: isManager,
            logged: true,
            evento: evento,
          });
        }
      }
    );
  } else {
    res.render("index", {
      protectionMessage: "Funzionalità non permessa",
    });
  }
};

// *** Gestione pagina Sigillo ***
exports.sigillo = (req, res) => {
  session = req.session;
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @sigillo");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isBiglietteria = false;
          if (role == 2) {
            isBiglietteria = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          res.render("sigillo", {
            isBiglietteria: isBiglietteria,
            logged: true,
          });
        }
      }
    );
  } else {
    res.render("index", {
      protectionMessage: "Funzionalità non permessa",
    });
  }
};

// *** Gestione pagina validazione ***
exports.validazione = (req, res) => {
  session = req.session;
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @validazione");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isManager = false;
          if (role == 1) {
            isManager = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          res.render("validazione", {
            isManager: isManager,
            logged: true,
          });
        }
      }
    );
  } else {
    res.render("index", {
      protectionMessage: "Funzionalità non permessa",
    });
  }
};

// *** Gestione funzione Logout ***
exports.logout = async (req, res) => {
  var events = await blockchainController.getEventi();
  if (req.session.loggedin == true) {
    log.action("ID: " + req.session.userid + " | Logout succesfull");
    req.session.destroy();
    res.render("index", {
      message: "Logout effettuato",
      events: events,
    });
  } else {
    res.render("login", {
      message: "Effettua prima l'accesso",
    });
  }
};

// *** Gestione pagina Compra Biglietto ***
exports.compraBiglietto = async (req, res) => {
  // Compra biglietto restituisce pagina di login se non loggati, restituisce pagina per comprare biglietti altrimenti
  session = req.session;
  const { id } = req.body;
  var evento = await blockchainController.getSingoloEvento(id);
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @compraBiglietto");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      async function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          req.session.tempRole = role; //Per passaggio info a funzione compra biglietto nella blockchain
          var isManager = false;
          var isBiglietteria = false;
          if (role == 1) {
            isManager = true;
          }
          if (role == 2) {
            isBiglietteria = true;
          }

          //Controlli sul numero di biglietti acquistabili
          let address = await cripter.decripta(session.blockchain_address);
          var biglietti = await blockchainController.bigliettiUtente(address);
          var bigliettiFiltered = biglietti.filter(function (
            value,
            index,
            arr
          ) {
            return value.eventId == id;
          });
          //var bigldisp = 5 - bigliettiFiltered.length;
          if (5 - bigliettiFiltered.length <= evento.ndispbiglietti) {
            var bigldisp = 5 - bigliettiFiltered.length;
          } else {
            var bigldisp = evento.ndispbiglietti;
          };
          var bigldisp1 = false;
          var bigldisp2 = false;
          var bigldisp3 = false;
          var bigldisp4 = false;
          var bigldisp5 = false;

          if (bigldisp == 1) {
            bigldisp1 = true;
          }
          if (bigldisp == 2) {
            bigldisp1 = true;
            bigldisp2 = true;
          }
          if (bigldisp == 3) {
            bigldisp1 = true;
            bigldisp2 = true;
            bigldisp3 = true;
          }
          if (bigldisp == 4) {
            bigldisp1 = true;
            bigldisp2 = true;
            bigldisp3 = true;
            bigldisp4 = true;
          }
          if (bigldisp == 5) {
            bigldisp1 = true;
            bigldisp2 = true;
            bigldisp3 = true;
            bigldisp4 = true;
            bigldisp5 = true;
          }
          //**************

          res.render("compra", {
            isManager: isManager,
            isBiglietteria: isBiglietteria,
            logged: true,
            evento: evento,
            bigldisp1: bigldisp1,
            bigldisp2: bigldisp2,
            bigldisp3: bigldisp3,
            bigldisp4: bigldisp4,
            bigldisp5: bigldisp5,
          });
        }
      }
    );
  } else {
    res.render("login", {
      message: "Effettua prima l'accesso",
    });
  }
};

// *** Gestione pagina profilo ***
exports.profilo = async (req, res) => {
  session = req.session;
  let address = await cripter.decripta(session.blockchain_address);
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @profilo");
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [session.userid],
      async function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const username = results[0].username;
          const surname = results[0].surname;
          const email = results[0].email;
          const role = results[0].role;
          var isUser = false;
          var isManager = false;
          var isBiglietteria = false;

          if (role == 0) {
            isUser = true;
          } else if (role == 1) {
            isManager = true;
          } else if (role == 2) {
            isBiglietteria = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          var biglietti = await blockchainController.bigliettiUtente(address);
          res.render("profilo", {
            logged: true,
            username: username,
            surname: surname,
            email: email,
            address: address,
            isUser: isUser,
            isManager: isManager,
            isBiglietteria: isBiglietteria,
            userlogged: true,
            biglietti: biglietti,
          });
        }
      }
    );
  } else {
    res.render("profilo");
  }
};

exports.gestioneUtenti = async (req, res) => {
  session = req.session;
  if (session.userid) {
    log.info("ID: " + session.userid + " | Visiting @gestioneUtenti");
    role = await db.query(
      "SELECT role FROM users WHERE id = ?",
      session.userid,
      function (error, results, fields) {
        if (error) {
          log.error(error);
        } else {
          const role = results[0].role;
          var isSystem = false;
          if (role == 10) {
            isSystem = true;
          } else {
            res.render("index", {
              protectionMessage: "Funzionalità non permessa",
            });
          }

          db.query(
            "SELECT username,surname,email,role FROM users WHERE NOT id = ?",
            session.userid,
            function (error, results, fields) {
              if (error) {
                log.error(error);
              } else {
                const users = results;
                res.render("gestioneUtenti", {
                  check: true,
                  logged: true,
                  users: users,
                });
              }
            }
          );
        }
      }
    );
  }
};

exports.systemLogin = (req, res) => {
  log.info("ID: " + req.session.userid + " | Visiting @systemLogin");
  res.render("systemLogin", {
    check: true,
  });
};
