const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session"); //per gestire render di pagine che variano in base alla sessione

/*
Definizioni rotte per le procedure di GET e POST relative al rendering delle pagine.
Per pagine ad interazione dinamica in base alla sessione di navigazione --> /controllers/session.js
*/
router.get("/", sessionController.home);
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/chisiamo", (req, res) => {
  res.render("chiSiamo");
});
router.get("/dovesiamo", (req, res) => {
  res.render("doveSiamo");
});
router.get("/termini", (req, res) => {
  res.render("termini");
});
router.get("/privacy", (req, res) => {
  res.render("privacy");
});
router.get("/eventi", sessionController.eventi);
router.get("/inserisciEventi", sessionController.inserisciEventi);
router.post("/modificaEvento", sessionController.modificaEvento);
router.post("/compraBiglietto", sessionController.compraBiglietto);
router.get("/sigillo", sessionController.sigillo);
router.get("/validazione", sessionController.validazione);
router.get("/logout", sessionController.logout);
router.get("/profilo", sessionController.profilo);
router.get("systemLogin", sessionController.systemLogin);

module.exports = router;