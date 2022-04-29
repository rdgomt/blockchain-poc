const uuidv1 = require('uuid').v1 // unique id based on timestamp
const EC = require('elliptic').ec // Elliptic Curve Cryptography
const ec = new EC('secp256k1')

class Crypto {
  static genKeyPair() {
    return ec.genKeyPair()
  }

  static genId() {
    return uuidv1()
  }
}

module.exports = Crypto