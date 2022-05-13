const Crypto = require('./utils/crypto')

// TODO: change to abstract class?
class Transaction {
  constructor() {
    this.id = Crypto.genId()
    this.input = null
    this.outputs = []
  }

  static create(senderWallet, recipientAddress, amount) {
    senderWallet.verifyBalance(amount)
    
    const transaction = new Transaction()

    transaction.outputs.push(...[
      // Debit transaction from sender's account
      {
        amount: - amount,
        address: senderWallet.address,
      },
      // Credit transaction in the recipient's account
      {
        amount,
        address: recipientAddress,
      }
    ])

    transaction.sign(senderWallet)

    return transaction
  }

  sign(senderWallet) {
    const hash = Crypto.hash(JSON.stringify(this.outputs)).toString()

    this.input = {
      timestamp: Date.now(),
      balance: senderWallet.balance,
      address: senderWallet.address,
      signature: senderWallet.sign(hash)
    }
  }

  static verifySignature(transaction) {
    const { address, signature } = transaction.input
    const hash = Crypto.hash(JSON.stringify(transaction.outputs)).toString()

    return Crypto.verifySignature(address, signature, hash)
  }

  update(senderWallet, recipientAddress, amount) {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.address)

    senderWallet.verifyBalance(amount + senderOutput.amount * (-1))

    senderOutput.amount = senderOutput.amount - amount

    this.outputs.push({
      amount,
      address: recipientAddress,
    })

    this.sign(senderWallet)

    return this
  }
}

module.exports = Transaction