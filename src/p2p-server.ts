import WebSocket from 'ws'
import { Blockchain } from './blockchain'
import { Transaction } from './transaction'
import { TransactionPool } from './transaction-pool'

const P2P_PORT = Number(process.env.P2P_PORT) || 5001
const PEERS = process.env.PEERS?.split(',') || []

enum MessageType {
  Chain = 'Chain',
  Transaction = 'Transaction',
}

export class P2pServer {
  private readonly blockchain: Blockchain
  private readonly transactionPool: TransactionPool
  private readonly sockets: WebSocket.WebSocket[]

  constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.sockets = []
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT })
    server.on('connection', (socket) => this.connectSocket(socket))
    console.log(`P2p server listening on port ${P2P_PORT}.`)

    this.connectToPeers()
  }

  connectToPeers() {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  connectSocket(socket: WebSocket.WebSocket) {
    this.sockets.push(socket)
    this.messageHandler(socket)
    this.broadcastChain(socket)
    console.log(`Socket connected.`)
  }

  broadcastChain(socket: WebSocket.WebSocket) {
    socket.send(
      JSON.stringify({
        type: MessageType.Chain,
        payload: this.blockchain.chain,
      })
    )
  }

  syncChain() {
    this.sockets.forEach((socket) => this.broadcastChain(socket))
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => {
      socket.send(
        JSON.stringify({
          type: MessageType.Transaction,
          payload: transaction,
        })
      )
    })
  }

  messageHandler(socket: WebSocket.WebSocket) {
    socket.on('message', (message) => {
      const data = JSON.parse(message.toString())

      switch (data.type) {
        case MessageType.Chain: {
          this.blockchain.replaceChain(data.payload)
          break
        }

        case MessageType.Transaction: {
          this.transactionPool.addOrUpdateTransaction(data.payload)
          break
        }
      }
    })
  }
}
