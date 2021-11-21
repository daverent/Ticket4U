const {
  transports
} = require("winston");
const winston = require("winston");

/*********************************************************************************************
 * Logger di Default per operazioni OFF-CHAIN
 */

/**
 * Definizione livelli di logging. Il livello x viene riportato in tutti i log con livello n>x.
 *                                 (es: livello system compare nel livello error, il livello action non compare in error)
 */
const myCustomLevels = {
  levels: {
    system: 0,
    error: 1,
    action: 2,
    info: 3,
  },
  colors: {
    error: "red",
    action: "blue",
    info: "green",
  },
};

winston.addColors(myCustomLevels.colors);

/**
 * Creazione logger (livelli e formato) con definizione dei transports su file
 */
const logger = winston.createLogger({
  level: "info",
  levels: myCustomLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.align(),
    winston.format.printf((info) => {
      return `[${info.timestamp}] [${info.level}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "logs/action.log",
      level: "action",
    }),
    new winston.transports.File({
      filename: "logs/combined.log"
    }),
  ],
  exitOnError: false,
});

/**
 * Aggiunta generazione file json
 * (per utilizzarlo nel caso in cui si dovesse fare analisi automatizzata log)
 */
logger.add(
  new transports.File({
    filename: "logs/json.log",
    level: "info",
    format: winston.format.json(),
  })
);

/*********************************************************************************************
 * Logger per gli eventi ON-CHAIN
 *                                (struttura simile all'off-chain sopra)
 */
const myBcCustomLevels = {
  levels: {
    error: 0,
    blockchain: 1,
    event_contract: 2,
    ticket_contract: 3,
  },
  colors: {
    error: "red",
    event_contract: "blue",
    ticket_contract: "green",
  },
};

winston.addColors(myBcCustomLevels.colors);

const bclogger = winston.createLogger({
  level: "ticket_contract",
  levels: myBcCustomLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.align(),
    winston.format.printf((info) => {
      return `[${info.timestamp}] [${info.level}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/event_contract.log",
      level: "event_contract",
    }),
    new winston.transports.File({
      filename: "logs/blockchain_error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/ticket_contract.log"
    }),
  ],
  exitOnError: false,
});

bclogger.add(
  new transports.File({
    filename: "logs/blockchain_json.log",
    level: "ticket_contract",
    format: winston.format.json(),
  })
);

/**
 *
 *********************************************************************************************/

module.exports = {
  logger: logger,
  bclogger: bclogger
};