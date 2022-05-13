const Crypto = require('./utils/crypto')
const Transaction = require('./transaction')

class Wallet {
  constructor() {
    this.balance = 100 // TODO: start with 0 in production
    this.keyPair = Crypto.genKeyPair()
    this.address = this.keyPair.getPublic().encode('hex')
  }

  sign(hash) {
    return this.keyPair.sign(hash)
  }

  createTransaction(address, amount, transactionPool) {
    this.verifyBalance(amount)

    let transaction = transactionPool.existingTransactionBySenderAddress(this.address)

    if (transaction) {
      transaction.update(this, address, amount)
    } else {
      transaction = Transaction.create(this, address, amount)
    }

    transactionPool.addOrUpdateTransaction(transaction)

    return transaction
  }

  verifyBalance(amount) {
    if (amount > this.balance) {
      throw new Error('Transaction Error: insufficient balance.')
    }
  }
}

module.exports = Wallet
