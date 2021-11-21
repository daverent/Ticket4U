/**
 * Import dei moduli di terze parti
 */
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
var crypto = require("crypto");

/**
 * Import dei moduli locali
 */
const loggerController = require('./controllers/logger')

/**
 * Inizializzazione del logger di default
 */
log = loggerController.logger;

/**
 * Configurazione del supporto ai segreti in variabili d'ambiente
 * (doc: https://www.npmjs.com/package/dotenv)
 */
dotenv.config({
  path: './configs/.env'
})

/**
 * Definizione della directory per i contenuti statici
 */
const publicDirectory = path.join(__dirname, './public');

/**
 * Inizializzazione expressjs
 * (doc: https://expressjs.com/)
 */
const app = express();

/**
 * Supporto alle pagine statiche nella publicDirectory
 */
app.use(express.static(publicDirectory));

/**
 * Supporto al parsing di url e json
 */
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());


/**
 * Inizializzazione di HBS engine per il rendering delle viste
 */
app.set('view engine', 'hbs');

/**
 * Definizione durata sessione: 30m in ms
 */
const oneSession = 1000 * 60 * 30;

/**
 * Middleware per gestione della sessione
 */
var secret = crypto.randomBytes(32).toString('hex');
app.use(sessions({
  secret: secret,
  saveUninitialized: true,
  cookie: {
    maxAge: oneSession
  },
  resave: false
}));
app.use(cookieParser());

/**
 * Definizione di partenza per rotte
 * Reindirizzate ai file contenuti in /routes
 */
app.use('/', require("./routes/pages"));
app.use('/auth', require('./routes/auth'));
app.use('/blockchain', require('./routes/blockchain'));

/**
 * Avvio
 */
app.listen(8888, () => {
  console.log("Server started on port 8888");
  log.system("Server Started");
});