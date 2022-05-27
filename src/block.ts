import { Crypto } from './utils/crypto'

export const MINE_RATE = 3000 // 3 seconds

export class Block {
  constructor(
    public readonly timestamp: number,
    public readonly lastHash: string,
    public data: unknown,
    public readonly hash: string,
    public readonly nonce: number,
    public readonly difficulty: number
  ) {}

  static genesis() {
    const timestamp = new Date('2022-04-08').getTime()
    const lastHash = '0'
    const data = 'Hello world from the blockchain genesis!'
    const nonce = 0
    const hash = this.hash(timestamp, lastHash, data, nonce, 4)

    return new Block(timestamp, lastHash, data, hash, nonce, 4)
  }

  static mineBlock(lastBlock: Block, data: unknown) {
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
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new Block(timestamp, lastHash, data, hash, nonce, difficulty)
  }

  static hash(
    timestamp: number,
    lastHash: string,
    data: unknown,
    nonce: number,
    difficulty: number
  ) {
    return Crypto.hash(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString()
  }

  static hashFromBlock(block: Block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    return this.hash(timestamp, lastHash, data, nonce, difficulty)
  }

  static adjustDifficulty(lastBlock: Block, timestamp: number) {
    let { difficulty } = lastBlock

    difficulty =
      timestamp > MINE_RATE + lastBlock.timestamp
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
