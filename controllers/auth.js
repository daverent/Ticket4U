const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const cripter = require("./cripter");
const sessionController = require("./session");
const blockchainController = require("./blockchain");
const loggerController = require("./logger");

const log = loggerController.logger;

var db = mysql.createConnection({
  //genera connessione con DB
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = (req, res) => {
  /*
  Funzione di registrazione.
  Richiede in POST:
                  [0]: username
                  [1]: email
                  [2]: password
                  [3]: passwordConfirm (conferma della password)
  
  Restituisce il render di /index o /register con esito
  */
  const {
    username,
    surname,
    email,
    password,
    passwordConfirm
  } = req.body;

  var regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$/;

  if(!regularExpression.test(password))
  {
    return res.render("register", {
      message: "La password non rispetta i requisiti di sicurezza minimi!"
    })
  };

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async function (error, results) {
      if (error) {
        log.error(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "L'email inserita è già in uso!",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Le password non coincidono!",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 12);
      var address = await blockchainController.creaAccount();
      //var address = "0x43833dd91f97fde56408ec29a2e4f66deefd408f"; //Per ricollegare account manualmente
      let encryptedAddress = await cripter.cripta(address);

      db.query(
        "INSERT INTO users SET ?", {
          username: username,
          surname: surname,
          email: email,
          password: hashedPassword,
          role: 0,
          blockchain_address: encryptedAddress,
        },
        (error, results) => {
          if (error) {
            log.error(error);
          } else {
            log.action("EMAIL: " + email + " | Registration succesful!");
            return res.render("index", {
              message: "Utente registrato correttamente!",
            });
          }
        }
      );
    }
  );
};

exports.login = (req, res) => {
  /*
  Funzione di login.
  Richiede in POST:
                  [0]: email
                  [1]: password
  
  Restituisce il render di /index o /register con esito
  Blocca l'account momentaneamente se troppi login falliti
  */
  var time = Date.now();
  const {
    email,
    password,
    tentativo
  } = req.body;
  numTentativo = Number(tentativo);
  if (req.session.acc && req.session.acc > numTentativo) {
    numTentativo = req.session.acc;
  } else {
    req.session.acc = numTentativo;
  }
  if (email && password) {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async function (error, results, fields) {
        if (error) {
          log.error(error);
        } else if (results.length > 0) {
          if (results[0].locked && results[0].locked_at > time - 600 * 1000) {
            //Locked vale ancora per 10min in millisecondi
            req.session.destroy();
            res.render("index", {
              error: "Utente temporaneamente bloccato.",
            });
          } else {
            let comparison = await bcrypt.compare(
              password,
              results[0].password
            );
            if (comparison) {
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

              db.query(
                "UPDATE users SET locked = ? WHERE email = ?",
                [false, email],
                function (error, results, fields) {
                  if (error) {
                    log.error(error.message);
                  }
                }
              );
              req.session.loggedin = true;
              req.session.userid = results[0].id;
              req.session.blockchain_address = results[0].blockchain_address;
              req.session.acc = 0;
              var isManager = false;
              var isBiglietteria = false;
              if (results[0].role == 1) {
                isManager = true;
              }
              if (results[0].role == 2) {
                isBiglietteria = true;
              }
              if (results[0].role == 10) {
                sessionController.systemLogin(req, res);
              } else {
                log.action(
                  "ID: " +
                  req.session.userid +
                  " | Is now logged with ROLE: " +
                  results[0].role
                );
                res.render("index", {
                  eventsSorted: eventsSorted,
                  logged: true,
                  isManager: isManager,
                  isBiglietteria: isBiglietteria,
                  message: "Accesso effettuato",
                });
              }
            } else {
              if (req.session.acc > 4 || numTentativo > 4) {
                req.session.destroy();
                db.query(
                  "UPDATE users SET locked = ?, locked_at = ? WHERE email = ?",
                  [true, time, email],
                  function (error, results, fields) {
                    if (error) {
                      log.error(error.message);
                    }
                  }
                );
                log.action(
                  "EMAIL: " +
                  email +
                  " | Account temporarily locked: too many login attempts"
                );
                return res.render("index", {
                  error: "Elevato numero di tentativi di accesso. Utente temporaneamente bloccato.",
                });
              }
              return res.render("login", {
                message: "Utente o password non corretti",
                tentativo: numTentativo + 1,
              });
            }
          }
        } else {
          if (req.session.acc > 4 || numTentativo > 4) {
            req.session.destroy();
            log.info("EMAIL: " + email + " | Tried login but already locked");
            return res.render("index", {
              error: "Elevato numero di tentativi di accesso. Utente temporaneamente bloccato.",
            });
          }
          req.session.acc++;
          log.info("EMAIL: " + email + " | Tried login but wrong credentials");
          return res.render("login", {
            message: "Utente o password non corretti",
            tentativo: numTentativo + 1,
          });
        }
      }
    );
  } else {
    return res.render("login", {
      message: "Inserire utente e password.",
    });
  }
};

exports.systemLogin = (req, res) => {
  /*
  Funzione di accesso amministratore.
  Richiede in POST:
                  [0]: pin (codice amministratore)
  
  Restituisce il render di /index con esito
  Se accesso chiama funzione session.gestionUtenti(...)
  */
  const {
    pin
  } = req.body;
  if (pin == process.env.PIN_SISTEMA) {
    log.action("ID: " + req.userid + " | Admin login succesfull!");
    sessionController.gestioneUtenti(req, res);
  } else {
    log.info("Admin tried login but failed");
    req.session.destroy();
    res.render("index", {
      error: "Riprovare.",
    });
  }
};

exports.cambiaRuolo = (req, res) => {
  /*
  Funzione per la modifica dei ruoli.
  Richiede in POST:
                  [0]: role
                  [1]: email
  
  Restituisce il render della stessa pagina con esito
  */
  const {
    role,
    email
  } = req.body;
  db.query(
    "UPDATE users SET role = ? WHERE email = ?",
    [role, email],
    function (error, results, fields) {
      if (error) {
        log.error(error);
      }
      log.action(
        "ID: " +
        req.session.userid +
        " | Admin modifies role of EMAIL: " +
        email +
        " in ROLE: " +
        role
      );
      db.query(
        "SELECT username,surname,email,role FROM users WHERE NOT id = ?",
        req.session.userid,
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
  );
};