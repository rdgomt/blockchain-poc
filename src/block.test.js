const { Block, MINE_RATE } = require('./block')

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

  it('should generate a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty))
      .toEqual('0'.repeat(block.difficulty))
  })

  it('should lower the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE + 1)).toEqual(block.difficulty - 1)
  })

  it('should increase the difficulty for quickly mined blocks', () => {    
    expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE - 1)).toEqual(block.difficulty + 1)
    expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE)).toEqual(block.difficulty + 1)
  })
})