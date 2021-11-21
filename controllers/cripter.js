const CryptoJS = require("crypto-js");

const secretKey = process.env.SEGRETO_CRIPTER;

exports.cripta = (text) => {
  /*
  Funzione di codifica di una stringa con hashing Rabbit.
  Parametro:
                  [0]: text
  
  Restituisce hashing della stringa
  */
  var hash = CryptoJS.Rabbit.encrypt(text, secretKey);
  return hash;
};

exports.decripta = async (hash) => {
  /*
  Funzione di decodifica di una stringa con hashing Rabbit.
  Parametro:
                  [0]: hash
  
  Restituisce stringa decodificata
  */
  var string = CryptoJS.Rabbit.decrypt(hash, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  if (!string || string === "") {
    //check errore stringa vuota
    console.log(
      "### ATTENZIONE! Errore in fase di decriptazione: si sta passando a decripter una stringa vuota. Verifica di aver effettuato correttamente l'accesso ###"
    );
  }
  return string;
};