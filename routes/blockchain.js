const express = require("express");
const blockchainController = require("../controllers/blockchain");
const router = express.Router();

/*
Definizioni rotte per le procedure di POST relative agli accessi in lettura o scrittura alla blockchain
*/
router.post("/inserisciEvento", blockchainController.inserisciEvento);
router.post("/modificaEvento", blockchainController.modificaEvento);
router.post("/eliminaEvento", blockchainController.eliminaEvento);
router.post("/compraBiglietto", blockchainController.compraBiglietto);
router.post("/validaBiglietto", blockchainController.validaBiglietto);
router.post("/sigillaBiglietto", blockchainController.sigillaBiglietto);

module.exports = router;