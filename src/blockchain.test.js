const Block = require('./block')
const Blockchain = require('./blockchain')

describe('Blockchain', () => {
  let blockchain
  let blockchain2

  beforeEach(() => {
    blockchain = new Blockchain()
    blockchain2 = new Blockchain()
  })

  it('should start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it('should be able to add a new block', () => {
    const data = 'I am a new block.'
    blockchain.addBlock(data)
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
  })

  it('should validate a valid chain', () => {
    blockchain2.addBlock('U$ 500')

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true)
  })

  it('should invalidate a chain with a corrupted genesis block', () => {
    blockchain2.chain[0].data = 'U$ 0'

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false)
  })

  it('should invalidate a corrupted chain', () => {
    blockchain2.addBlock('U$ 200')
    blockchain2.chain[1].data = 'U$ 1000'

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false)
  })

  it('should replace the chain with a valid chain', () => {
    blockchain2.addBlock('U$ 200')
    blockchain.replaceChain(blockchain2.chain)

    expect(blockchain.chain).toEqual(blockchain2.chain)
  })

  it('should not replace the chain if the input has less or equal length', () => {
    blockchain.addBlock('U$ 100')
    blockchain.replaceChain(blockchain2.chain)

    expect(blockchain.chain).not.toEqual(blockchain2.chain)
  })

  it('should not replace the chain if the input has corrupted blocks', () => {
    blockchain.addBlock('Tx1: U$ 100')
    blockchain.addBlock('Tx2: U$ 200')

    blockchain2.addBlock('Tx1: U$ 100')
    blockchain2.addBlock('Tx2: U$ 200')
    blockchain2.chain[1].data = 'Tx1: U$ 0'

    blockchain.replaceChain(blockchain2.chain)

    expect(blockchain.chain).not.toEqual(blockchain2.chain)
  })
})