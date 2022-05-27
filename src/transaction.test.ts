import { Transaction } from './transaction'
import { Wallet } from './wallet'

describe('Transaction', () => {
  let senderWallet: Wallet,
    recipientAddress: string,
    amount: number,
    transaction: Transaction

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

  it("should register in it's outputs the deduction from the sender's wallet", () => {
    expect(
      transaction.outputs.find(
        (output) => output.address === senderWallet.address
      ).amount
    ).toEqual(-amount)
  })

  it("should register in it's outputs the addition in the recipient's wallet", () => {
    expect(
      transaction.outputs.find((output) => output.address === recipientAddress)
        .amount
    ).toEqual(amount)
  })

  it("should register in it's input the balance from sender's wallet", () => {
    expect(transaction.input.balance).toEqual(senderWallet.balance)
  })

  it('should validate a valid transaction', () => {
    expect(Transaction.verifySignature(transaction)).toBe(true)
  })

  it('should invalidate a corrupted transaction', () => {
    transaction.outputs[0].amount = 50000

    expect(Transaction.verifySignature(transaction)).toBe(false)
  })

  it('should be able to update a transaction (add new outputs)', () => {
    const nextRecipientAddress = '0x8C70933F9EE2714B803940BA8ef0D2175f70bd66'
    const nextAmount = 20

    transaction = transaction.update(
      senderWallet,
      nextRecipientAddress,
      nextAmount
    )

    const senderOutput = transaction.outputs.find(
      (output) => output.address === senderWallet.address
    )
    expect(senderOutput.amount).toEqual(-amount - nextAmount)

    const nextRecipientOutput = transaction.outputs.find(
      (output) => output.address === nextRecipientAddress
    )
    expect(nextRecipientOutput.amount).toEqual(nextAmount)

    expect(Transaction.verifySignature(transaction)).toBe(true)
  })
})
