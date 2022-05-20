const SHA256 = require('crypto-js/sha256')
const uuid = require('uuid').v4
const EC = require('elliptic').ec // Elliptic Curve Cryptography

const ec = new EC('secp256k1')

class Crypto {
  static genKeyPair() {
    return ec.genKeyPair()
  }

  static genId() {
    return uuid()
  }

  static hash(data) {
    return SHA256(JSON.stringify(data))
  }

  static verifySignature(address, signature, hash) {
    return ec.keyFromPublic(address, 'hex').verify(hash, signature)
  }
}

module.exports = Crypto