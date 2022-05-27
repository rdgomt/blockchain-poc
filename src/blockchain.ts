import { Block } from './block'

export class Blockchain {
  public chain: Block[]

  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock(data: unknown) {
    const lastBlock = this.chain[this.chain.length - 1]
    const block = Block.mineBlock(lastBlock, data)
    this.chain.push(block)
    return block
  }

  isValidChain(chain: Block[]) {
    const originalGenesisBlockString = JSON.stringify(Block.genesis())
    const inputGenesisBlockString = JSON.stringify(chain[0])

    if (originalGenesisBlockString !== inputGenesisBlockString) {
      console.log('Genesis block is invalid.')
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]

      if (block.lastHash !== lastBlock.hash) {
        console.log(`Last hash from Block #${i} is invalid.`)
        return false
      }

      if (block.hash !== Block.hashFromBlock(block)) {
        console.log(`Hash from Block #${i} is invalid.`)
        return false
      }
    }

    return true
  }

  replaceChain(newChain: Block[]) {
    if (newChain.length <= this.chain.length) {
      return console.log('Input chain is no longer than the current chain.')
    }
    if (!this.isValidChain(newChain)) {
      return console.log('The input chain is not valid.')
    }

    console.log('Replacing main chain with the new chain.')
    return (this.chain = newChain)
  }
}
