const Transaction = require('./transaction')
const Wallet = require('./wallet')

describe('Transaction', () => {
  let senderWallet, recipientAddress, amount, transaction

  beforeEach(() => {
    senderWallet = new Wallet()
    recipientAddress = '0x8C70933F9EE2714B803940BA8ef0D2175f70bd65'
    amount = 50
    transaction = Transaction.create(senderWallet, recipientAddress, amount)
  })

  it("should throw an error if the sender's wallet has insufficient balance for the transaction", () => {
    expect(() => {
      amount = 150
      transaction = Transaction.create(senderWallet, recipientAddress, amount)
    }).toThrowError()
  })

  it("should register in the transaction's outputs the deduction from the sender's wallet", () => {
    expect(transaction.outputs.find(output => output.address === senderWallet.address).amount)
      .toEqual(senderWallet.balance - amount)
  })

  it("should register in the transaction's outputs the addition in the recipient's wallet", () => {
    expect(transaction.outputs.find(output => output.address === recipientAddress).amount)
      .toEqual(amount)
  })
})