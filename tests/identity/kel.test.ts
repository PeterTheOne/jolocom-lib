import { ICP } from '../../ts/identity/local/events/icp'
import { KEL } from '../../ts/identity/local/events/kel'
import { expect } from 'chai'

describe('KEL', () => {
  it('correctly constructs an empty kel', () => {
    const kel = new KEL()
    expect(kel.keyState).to.deep.eq({
      keys: [],
      threshold: 0,
    })
  })

  it('correctly constructs a populated kel', () => {
    const kel = new KEL([ICP])
    expect(kel.keyState).to.deep.eq({
      keys: ICP.keys,
      threshold: ICP.sith,
    })
  })

  it('correctly serializes to DID Document', () => {
    const kel = new KEL()
    kel.update(ICP)
    const didDoc = kel.toDidDocument()
    expect(didDoc.publicKey.length).to.eq(1)
    expect(didDoc.publicKey[0].toJSON()).to.deep.eq({
      "id": "did:un:GA6NLmfIseQxONrKzwsNaNtsGIm5BxpL8gri1asHFQMW9#keys-1",
      "owner": "did:un:GA6NLmfIseQxONrKzwsNaNtsGIm5BxpL8gri1asHFQMW9",
      "publicKeyHex": "03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd",
      "type": "Secp256k1VerificationKey2018"
    })
  })
})

