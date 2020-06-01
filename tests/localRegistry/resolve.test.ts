import * as sinon from 'sinon'
import { createLocalRegistry } from '../../ts/registries/localRegistry'
import { expect } from 'chai'
import { Identity } from '../../ts/identity/identity'
import { ErrorCodes } from '../../ts/errors'
import { ICP } from '../../ts/identity/local/events/icp'

describe('Local Registry - resolve', () => {
  it('should correctly resolve DID with no public profile', async () => {
    const registry = createLocalRegistry()
    registry.update(ICP)

    const identity: Identity = await registry.resolve(ICP.id)
    expect(identity.didDocument.did).to.eq(`did:un:${ICP.id}`) // TODO cleaner check
    expect(identity.publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    const registry = createLocalRegistry()

    try {
      await registry.resolve('did:x')
      expect(true).to.be.false // TODO This pattern has to go
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.RegistryResolveFailed)
    }
  })

  it('should resolve with public profile', async () => {
    // const extendedDidDoc = {
    //   ...didDocumentJSON,
    //   service: [mockPubProfServiceEndpointJSON],
    // }

    // registry.ethereumConnector.resolveDID = sinon.stub().returns(mockIpfsHash)
    // registry.ipfsConnector.catJSON = sinon.stub().resolves(extendedDidDoc)
    // registry.fetchPublicProfile = sinon
    //   .stub()
    //   .resolves(SignedCredential.fromJSON(publicProfileCredJSON))

    // const identity: Identity = await registry.resolve(mockDid)
    // expect(identity.didDocument.toJSON()).to.deep.eq(extendedDidDoc)
    // expect(identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
  })

  it('should implement fetchPublicProfile', async () => {
    // registry.ipfsConnector.catJSON = sinon
    //   .stub()
    //   .resolves(publicProfileCredJSON)

    // const pubProf = await registry.fetchPublicProfile(`ipfs://${mockIpfsHash}`)
    // expect(pubProf).to.deep.eq(SignedCredential.fromJSON(publicProfileCredJSON))
    // expect(registry.ipfsConnector.catJSON.getCall(0).args).to.deep.eq([
    //   mockIpfsHash,
    // ])
  })
})
