import { IVaultedKeyProvider, IKeyDerivationArgs } from './types'
import { VKP } from 'vkp-rs'
import { IDigestable } from '../linkedDataSignature/types'

export class WasmKeyProvider implements IVaultedKeyProvider {
  private readonly wasmModule: VKP

  public constructor(encryptedSeed: Buffer) {
    this.wasmModule = VKP.new(encryptedSeed)
  }

  // public static fromSeed(
  //   seed: Buffer,
  //   encryptionPass: string,
  // ): WasmKeyProvider {
  //   const wasm = VKP.from_seed(seed, encryptionPass)
  // }

  public getPublicKey({
    derivationPath,
    encryptionPass,
  }: IKeyDerivationArgs): Buffer {
    return Buffer.from(
      this.wasmModule.get_public_key(derivationPath, encryptionPass),
    )
  }

  public getPrivateKey(derivationArgs: IKeyDerivationArgs): Buffer {
    return new Buffer('')
  }

  public sign(
    { derivationPath, encryptionPass }: IKeyDerivationArgs,
    digest: Buffer,
  ): Buffer {
    return Buffer.from(
      this.wasmModule.sign(derivationPath, encryptionPass, digest),
    )
  }

  public async signDigestable(
    derivationArgs: IKeyDerivationArgs,
    toSign: IDigestable,
  ): Promise<Buffer> {
    return this.sign(derivationArgs, await toSign.digest())
  }
}
