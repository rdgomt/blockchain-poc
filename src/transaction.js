const Crypto = require('./utils/crypto')

// TODO: change to abstract class?
class Transaction {
  constructor() {
    this.id = Crypto.genId()
    this.input = null
    this.outputs = []
  }

  static create(senderWallet, recipientAddress, amount) {
    if (amount > senderWallet.balance) {
      throw new Error('Transaction Error: insufficient balance.')
    }

    const transaction = new Transaction()

    transaction.outputs.push(...[
      // Debit transaction from sender's account
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.address,
      },
      // Credit transaction in the recipient's account
      {
        amount,
        address: recipientAddress,
      }
    ])

    return transaction
  }
}

module.exports = Transaction