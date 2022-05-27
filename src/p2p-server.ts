import WebSocket from 'ws'
import { Blockchain } from './blockchain'

const P2P_PORT = Number(process.env.P2P_PORT) || 5001
const PEERS = process.env.PEERS?.split(',') || []

export class P2pServer {
  private readonly blockchain: Blockchain
  private readonly sockets: WebSocket.WebSocket[]

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain
    this.sockets = []
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT })
    server.on('connection', (socket) => this.connectSocket(socket))
    this.connectToPeers()
    console.log(`P2p server listening on port ${P2P_PORT}.`)
  }

  connectSocket(socket: WebSocket.WebSocket) {
    this.sockets.push(socket)
    this.messageHandler(socket)
    this.sendChain(socket)
    console.log(`Socket connected.`)
  }

  sendChain(socket: WebSocket.WebSocket) {
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  connectToPeers() {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket: WebSocket.WebSocket) {
    socket.on('message', (message) => {
      const newChain = JSON.parse(message.toString())
      this.blockchain.replaceChain(newChain)
    })
  }

  syncChain() {
    this.sockets.forEach((socket) => this.sendChain(socket))
  }
}
