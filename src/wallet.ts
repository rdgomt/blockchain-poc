import { ec } from 'elliptic'
import { Transaction } from './transaction'
import { Crypto } from './utils/crypto'

export type ISignature = ec.Signature
export type IKeyPair = ec.KeyPair

export class Wallet {
  public readonly balance: number
  public readonly keyPair: IKeyPair
  public readonly address: string

  constructor() {
    this.balance = 100 // TODO: start with 0 in production
    this.keyPair = Crypto.genKeyPair()
    this.address = this.keyPair.getPublic().encode('hex', true)
  }

  sign(hash: string) {
    return this.keyPair.sign(hash)
  }

  createTransaction(address: string, amount: number, transactionPool) {
    this.verifyBalance(amount)

    let transaction = transactionPool.existingTransactionBySenderAddress(
      this.address
    )

    if (transaction) {
      transaction.update(this, address, amount)
    } else {
      transaction = Transaction.create(this, address, amount)
    }

    transactionPool.addOrUpdateTransaction(transaction)

    return transaction
  }

  verifyBalance(amount: number) {
    if (amount > this.balance) {
      throw new Error('Transaction Error: insufficient balance.')
    }
  }
}
