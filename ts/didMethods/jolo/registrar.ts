import { Identity } from '../../identity/identity'
import { getRegistry } from 'jolo-did-registry'
import { IVaultedKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'
import { DidDocument } from '../../identity/didDocument/didDocument'
import {
  ServiceEndpointsSection,
  PublicKeySection,
} from '../../identity/didDocument/sections'
import { fuelKeyWithEther } from '../../utils/helper'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from './constants'
import { fromSeed } from 'bip32'

const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0"

export class JolocomRegistrar implements IRegistrar {
  public prefix = 'jolo'
  public registry: ReturnType<typeof getRegistry>

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT,
  ) {
    this.registry = getRegistry(providerUrl, contractAddress, ipfsHost)
  }

  async create(keyProvider: IVaultedKeyProvider, password: string) {
    const identityKeyInfo = keyProvider.newKeyPair(
      password,
      KeyTypes.ecdsaSecp256k1VerificationKey2019,
    )

    const identity = Identity.fromDidDocument({
      didDocument: await DidDocument.fromPublicKey(
        PublicKeySection.fromJSON(identityKey),
      ),
    })

    await this.signDidDocument(identity.didDocument, keyProvider, password)

    await this.update(keyProvider, password, identity.didDocument)

    return identity
  }

  // TODO Verify signature on the public profile? Or just assume it's correct
  // TODO Public profile should perhaps be JSON / any, so that the registrars can be used without having to typecheck / guard / use generics
  async updatePublicProfile(
    keyProvider: IVaultedKeyProvider,
    password: string,
    identity: Identity,
    publicProfile: SignedCredential,
  ) {
    const { didDocument } = identity

    const publicProfileEntry = ServiceEndpointsSection.fromJSON(
      await this.registry.publishPublicProfile(
        identity.did,
        publicProfile.toJSON(),
      ),
    )

    const oldPublicProfileEntry = didDocument.service.findIndex(
      ({ type }) =>
        type ===
        claimsMetadata.publicProfile.type[
          claimsMetadata.publicProfile.type.length - 1
        ],
    )

    if (oldPublicProfileEntry !== -1) {
      didDocument.service.splice(oldPublicProfileEntry, 1, publicProfileEntry)
    } else {
      didDocument.addServiceEndpoint(publicProfileEntry)
    }

    identity.publicProfile = publicProfile

    await this.signDidDocument(didDocument, keyProvider, password)

    return this.update(keyProvider, password, didDocument).then(() => true)
  }

  async encounter() {
    console.error(`"encounter" not implemented for did:${this.prefix}`) // TODO Better error
    return false
  }

  private async signDidDocument(
    didDocument: DidDocument,
    keyProvider: IVaultedKeyProvider,
    password: string,
  ) {
    didDocument.hasBeenUpdated()
    return didDocument.sign(keyProvider, {
      keyRef: KeyTypes.jolocomIdentityKey,
      encryptionPass: password,
    })
  }

  private async update(
    keyProvider: IVaultedKeyProvider,
    password: string,
    didDocument: DidDocument,
  ) {
    // Essentialy sign_raw with the encoded TX kinda, not really, this is Recoverable signature
    const ethKP = fromSeed(keyProvider.getRandom(32)).derivePath(
      ETH_DERIVATION_PATH,
    )

    await fuelKeyWithEther(ethKP.publicKey)

    return this.registry.commitDidDoc(
      ethKP.privateKey,
      // @ts-ignore TODO The DID Document related types need to be harmonized
      didDocument.toJSON(),
    )
  }
}
