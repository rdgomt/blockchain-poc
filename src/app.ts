import express from 'express'
import { Blockchain } from './blockchain'
import { P2pServer } from './p2p-server'
import { TransactionPool } from './transaction-pool'
import { Wallet } from './wallet'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()

const app = express()
app.use(express.json())

app.get('/blocks', (_req, res) => {
  res.json(blockchain.chain)
})

app.post('/mine', (req, res) => {
  blockchain.addBlock(req.body.data)
  p2pServer.syncChain()
  res.redirect('/blocks')
})

app.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions)
})

app.post('/transactions', (req, res) => {
  const { recipientAddress, amount } = req.body
  const wallet = new Wallet()
  const transaction = wallet.createTransaction(
    recipientAddress,
    amount,
    transactionPool
  )
  p2pServer.broadcastTransaction(transaction)
  res.redirect('/transactions')
})

app.listen(HTTP_PORT, () =>
  console.log(`HTTP server is listening on ${HTTP_PORT}.`)
)

const p2pServer = new P2pServer(blockchain, transactionPool)
p2pServer.listen()
