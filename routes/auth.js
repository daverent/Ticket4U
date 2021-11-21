const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

/*
Definizioni rotte per le procedure di POST relative agli accessi o alla gestione degli account
*/
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/systemLogin', authController.systemLogin);
router.post('/cambiaRuolo', authController.cambiaRuolo);

module.exports = router;