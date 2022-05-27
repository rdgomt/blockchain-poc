import express from 'express'
import { Blockchain } from './blockchain'
import { P2pServer } from './p2p-server'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const blockchain = new Blockchain()

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

app.listen(HTTP_PORT, () =>
  console.log(`HTTP server is listening on ${HTTP_PORT}.`)
)

const p2pServer = new P2pServer(blockchain)
p2pServer.listen()
