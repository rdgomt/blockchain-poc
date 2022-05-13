const TransactionPool = require('./transaction-pool')
const Wallet = require('./wallet')

describe('Wallet', () => {
  let wallet, transactionPool, recipientAddress, amount

  beforeEach(() => {
    wallet = new Wallet()
    transactionPool = new TransactionPool()
    recipientAddress = '0x8C70933F9EE2714B803940BA8ef0D2175f70bd65'
    amount = 20
  })

  it('should throw an error if the wallet has insufficient balance for a transaction', () => {
    expect(() => wallet.verifyBalance(500)).toThrowError()
  })

  it('should be able to create a transaction', () => {
    const transaction = wallet.createTransaction(recipientAddress, amount, transactionPool)
    expect(transaction).toBeTruthy()

    const transactionInTransactionPool = transactionPool.transactions
      .filter(t => t.input.address === wallet.address)

    expect(transactionInTransactionPool.length).toEqual(1)
    expect(transactionInTransactionPool[0].outputs.length).toEqual(2)
  })

  it('should be able to update a transaction', () => {
    wallet.createTransaction(recipientAddress, amount, transactionPool)
    wallet.createTransaction(recipientAddress, amount + 10, transactionPool)

    const transactionInTransactionPool = transactionPool.transactions
      .filter(t => t.input.address === wallet.address)

    expect(transactionInTransactionPool.length).toEqual(1)
    expect(transactionInTransactionPool[0].outputs.length).toEqual(3)
  })
})
