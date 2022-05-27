import { Transaction } from './transaction'

export class TransactionPool {
  public transactions: Transaction[] = []

  existingTransactionBySenderAddress(senderAddress: string) {
    return this.transactions.find(
      (transaction) => transaction.input.address === senderAddress
    )
  }

  addOrUpdateTransaction(transaction: Transaction) {
    const existingTransaction = this.transactions.find(
      (t) => t.id === transaction.id
    )

    if (existingTransaction) {
      this.transactions[this.transactions.indexOf(existingTransaction)] =
        transaction
    } else {
      this.transactions.push(transaction)
    }
  }
}
