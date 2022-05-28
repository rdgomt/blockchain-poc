import { Blockchain } from './blockchain'
import { P2pServer } from './p2p-server'
import { TransactionPool } from './transaction-pool'
import { Wallet } from './wallet'

export class Miner {
  constructor(
    private readonly blockchain: Blockchain,
    private readonly transactionPool: TransactionPool,
    private readonly wallet: Wallet,
    private readonly p2pServer: P2pServer
  ) {}

  mine() {
    // TODO:
    // 1) const validTransactions = this.transactionPool.getValidTransactions()
    // 2) include a reward to the miner
    // 3) create a block with valid transactions
    // 4) sync the chains in the p2p server
    // 5) clear the transaction pool
    // 6) broadcast to every miner to clear their transaction pool
  }
}
