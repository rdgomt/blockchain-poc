import SHA256 from 'crypto-js/sha256'
import { ec as EC, SignatureInput } from 'elliptic'
import { v4 as uuidv4 } from 'uuid'

const ec = new EC('secp256k1') // Elliptic Curve Cryptography

export class Crypto {
  static genKeyPair() {
    return ec.genKeyPair()
  }

  static genId() {
    return uuidv4()
  }

  static hash(data: unknown) {
    return SHA256(JSON.stringify(data))
  }

  static verifySignature(
    address: string,
    signature: SignatureInput,
    hash: string
  ) {
    return ec.keyFromPublic(address, 'hex').verify(hash, signature)
  }
}
