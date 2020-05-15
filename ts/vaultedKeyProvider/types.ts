import { IDigestable } from '../linkedDataSignature/types'

export enum KeyTypes {
  jolocomIdentityKey = "m/73'/0'/0'/0",
  ethereumKey = "m/44'/60'/0'/0/0",
}

export interface IVaultedKeyProvider {
  getPublicKey: (derivationArgs: IKeyDerivationArgs) => Buffer
  getPrivateKey: (derivationArgs: IKeyDerivationArgs) => Buffer
  sign: (derivationArgs: IKeyDerivationArgs, digest: Buffer) => Buffer
  signDigestable: (
    derivationArgs: IKeyDerivationArgs,
    toSign: IDigestable,
  ) => Promise<Buffer>
  asymEncrypt: (pubKey: Buffer, data: Buffer) => Promise<Buffer>
  asymDecrypt: (
    derivationArgs: IKeyDerivationArgs,
    data: Buffer,
  ) => Promise<Buffer>
}

export interface IKeyDerivationArgs {
  encryptionPass: string
  derivationPath: string
}
