const SHA256 = require('crypto-js/sha256')

const MINE_RATE = 3000 // 3 seconds

class Block {
  constructor(timestamp, lastHash, data, hash, nonce, difficulty) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.data = data
    this.hash = hash
    this.nonce = nonce
    this.difficulty = difficulty
  }

  static genesis() {
    const timestamp = new Date('2022-04-08').getTime()
    const lastHash = '0'
    const data = 'Hello world from the blockchain genesis!'
    const nonce = 0
    const hash = this.hash(timestamp, lastHash, data, nonce, 4)

    return new Block(timestamp, lastHash, data, hash, nonce, 4)
  }

  static mineBlock(lastBlock, data) {
    const lastHash = this.hashFromBlock(lastBlock)
    let { difficulty } = lastBlock
    let timestamp = Date.now()
    let nonce = 0
    let hash = ''

    do {
      nonce++
      timestamp = Date.now()
      difficulty = this.adjustDifficulty(lastBlock, timestamp)
      hash = this.hash(timestamp, lastHash, data, nonce, difficulty)
    } while (
      hash.substring(0, difficulty) !== '0'.repeat(difficulty)
    )

    return new Block(timestamp, lastHash, data, hash, nonce, difficulty)
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
  }

  static hashFromBlock(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    return this.hash(timestamp, lastHash, data, nonce, difficulty)
  }

  static adjustDifficulty(lastBlock, timestamp) {
    let { difficulty } = lastBlock

    difficulty = timestamp > MINE_RATE + lastBlock.timestamp 
      ? difficulty - 1
      : difficulty + 1

    return difficulty
  }

  toString() {
    return `
      - Timestamp = ${this.timestamp}
      - LastHash = ${this.lastHash} 
      - Hash = ${this.hash}
      - Data = ${this.data}
      - Nonce = ${this.nonce}
      - Difficulty = ${this.difficulty}
    `
  }
}

module.exports = {
  Block,
  MINE_RATE,
}
