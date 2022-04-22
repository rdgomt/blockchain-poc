const Block = require('./block')

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1]
    const block = Block.mineBlock(lastBlock, data)
    this.chain.push(block)
    return block
  }

  isValidChain(chain) {
    const originalGenesisBlockString = JSON.stringify(Block.genesis())
    const inputGenesisBlockString = JSON.stringify(chain[0])

    if (originalGenesisBlockString !== inputGenesisBlockString) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]

      if (block.lastHash !== lastBlock.hash || block.hash !== Block.hashFromBlock(block)) {
        return false
      }
    }

    return true
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length || !this.isValidChain(newChain)) {
      return
    }

    this.chain = newChain
  }
}

module.exports = Blockchain