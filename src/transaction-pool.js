class TransactionPool {
  constructor() {
    this.transactions = []
  }

  existingTransactionBySenderAddress(senderAddress) {
    return this.transactions.find(transaction => transaction.input.address === senderAddress)
  }

  addOrUpdateTransaction(transaction) {
    const existingTransaction = this.transactions.find(t => t.id === transaction.id)
    
    if (existingTransaction) {
      this.transactions[this.transactions.indexOf(existingTransaction)] = transaction
    } else {
      this.transactions.push(transaction)
    }
  }
}

module.exports = TransactionPool