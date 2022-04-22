const WebSocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const PEERS = process.env.PEERS?.split(',') || []

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain
    this.sockets = []
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT })
    server.on('connection', (socket) => this.connectSocket(socket))
    this.connectToPeers()
    console.log(`P2p server listening on port ${P2P_PORT}.`)
  }

  connectSocket(socket) {
    this.sockets.push(socket)
    this.messageHandler(socket)
    this.sendChain(socket)
    console.log(`Socket connected.`)
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  connectToPeers() {
    PEERS.forEach(peer => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket) {
    socket.on('message', (message) => {
      const newChain = JSON.parse(message)
      this.blockchain.replaceChain(newChain)
    })
  }

  syncChain() {
    this.sockets.forEach(socket => this.sendChain(socket))
  }
}

module.exports = P2pServer
