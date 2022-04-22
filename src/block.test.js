const Block = require('./block')

describe('Block', () => {
  let data, lastBlock, block

  beforeEach(() => {
    lastBlock = Block.genesis()
    data = 'Hello world from blockchain!'
    block = Block.mineBlock(lastBlock, data)
  })

  it('should set the data field to match the input', () => {
    expect(block.data).toEqual(data)
  })

  it('should set the lastHash field to match the hash of the previous block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash)
  })
})