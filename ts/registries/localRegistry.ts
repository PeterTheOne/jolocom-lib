import { IdentityWallet } from '../identityWallet/identityWallet'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { Identity } from '../identity/identity'
import { IRegistryCommitArgs, IRegistry } from './types'
import {
  IVaultedKeyProvider,
  IKeyDerivationArgs,
} from '../vaultedKeyProvider/types'
import { KEL } from '../identity/local/events/kel'
import { TEMP_EVENT } from '../identity/local/events/icp'
import { ErrorCodes } from '../errors'

/**
 * @class
 *
 */

export class LocalRegistry implements IRegistry {
  private perspective: { [key: string]: KEL } = {}

  /**
   * Registers a  new Jolocom identity on Ethereum and IPFS and returns an instance of the Identity Wallet class
   * @example `const identityWallet = await registry.create(vaultedProvider, 'password')`
   */

  public async create(
    vaultedKeyProvider: IVaultedKeyProvider,
    decryptionPassword: string,
  ): Promise<IdentityWallet> {
    throw new Error('Not implemented')
  }

  /**
   * Stores the passed didDocument / public profile on IPFS and updates the mapping in the smart contract.
   * @deprecated Will be modified in next major release to not require access to the vault
   * @example `await registry.commit({ vaultedKeyProvider, keyMetadata, identityWallet })`
   */

  public async commit(commitArgs: IRegistryCommitArgs) {
    throw new Error('Not implemented')
  }

  /**
   * Resolves a jolocom did and returns an {@link Identity} class instance
   * @param did - The jolocom did to resolve
   * @example `const serviceIdentity = await registry.resolve('did:jolo:...')`
   */

  public async resolve(did: string): Promise<Identity> {
    //TODO dry
    const kel = this.perspective[did]
    if (!kel) throw new Error(ErrorCodes.RegistryResolveFailed)

    return Identity.fromDidDocument({
      didDocument: kel.toDidDocument(),
      publicProfile: await this.fetchPublicProfile(did),
    })
  }

  public update(event: TEMP_EVENT) {
    const kel = this.perspective[event.id]

    if (!kel) {
      this.perspective[event.id] = new KEL([event])
    } else {
      kel.update(event)
    }
  }

  /**
   * Derives the identity public key, fetches the public
   *   profile and did document, and instantiates an identity wallet
   *   with the vault, decryption pass, and and key metadata
   * @example `const wallet = registry.authenticate(vault, { derivationPath: '...', encryptionPass: '...'})`
   */

  public async authenticate(
    vaultedKeyProvider: IVaultedKeyProvider,
    derivationArgs: IKeyDerivationArgs,
    did?: string,
  ): Promise<IdentityWallet> {
    throw new Error('Not implemented')
  }

  /**
   * Fetches the public profile signed credential form ipfs
   * @param entry - IPFS hash of public profile credential
   * @example `const pubProf = await registry.fetchPublicProfile('ipfs://Qm...')`
   * @internal
   */

  public async fetchPublicProfile(hash: string): Promise<SignedCredential> {
    return undefined
  }
}

export const createLocalRegistry = () => new LocalRegistry()
