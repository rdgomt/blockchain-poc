const Crypto = require('./utils/crypto')

class Wallet {
  constructor() {
    this.balance = 100 // TODO: start with 0 in production
    this.keyPair = Crypto.genKeyPair()
    this.address = this.keyPair.getPublic().encode('hex')
  }

  toString() {
    return `
      - Address = ${this.address.toString()}
      - Balance = ${this.balance}
    `
  }
}

module.exports = Wallet
