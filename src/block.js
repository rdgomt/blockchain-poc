const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(timestamp, lastHash, data, hash) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.data = data
    this.hash = hash
  }

  static genesis() {
    const timestamp = new Date('2022-04-08').getTime()
    const lastHash = '0'
    const data = 'Hello world from the blockchain genesis!'
    const hash = this.hash(timestamp, lastHash, data)

    return new Block(timestamp, lastHash, data, hash)
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now()
    const lastHash = this.hashFromBlock(lastBlock)
    const hash = this.hash(timestamp, lastHash, data)

    return new Block(timestamp, lastHash, data, hash)
  }

  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString()
  }

  static hashFromBlock(block) {
    const { timestamp, lastHash, data } = block
    return this.hash(timestamp, lastHash, data)
  }

  toString() {
    return `
      - Timestamp = ${this.timestamp}
      - LastHash = ${this.lastHash} 
      - Hash = ${this.hash}
      - Data = ${this.data}
    `
  }
}

module.exports = Block
