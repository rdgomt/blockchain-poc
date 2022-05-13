const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./wallet')

describe('TransactionPool', () => {
  let senderWallet, recipientAddress, amount, transaction, transactionPool

  beforeEach(() => {
    senderWallet = new Wallet()
    recipientAddress = '0x8C70933F9EE2714B803940BA8ef0D2175f70bd65'
    amount = 50
    transaction = Transaction.create(senderWallet, recipientAddress, amount)
    transactionPool = new TransactionPool()
  })

  it('should be able to add a transaction to the pool', () => {
    transactionPool.addOrUpdateTransaction(transaction)

    expect(transactionPool.transactions.find(t => t.id === transaction.id)).toEqual(transaction)
  })

  it('should be able to update a transaction in the pool', () => {
    const nextRecipientAddress = '0x8C70933F9EE2714B803940BA8ef0D2175f70bd66'
    const nextAmount = 20

    const oldTransaction = JSON.stringify(transaction)
    const updatedTransaction = transaction.update(senderWallet, nextRecipientAddress, nextAmount)
    transactionPool.addOrUpdateTransaction(updatedTransaction)
    
    expect(JSON.stringify(transactionPool.transactions.find(t => t.id === updatedTransaction.id)))
      .not.toEqual(oldTransaction)
  })
})
