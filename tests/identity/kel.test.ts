import { ICP } from '../../ts/identity/local/events/icp'
import { KEL } from '../../ts/identity/local/events/kel'
import { expect } from 'chai'

describe.only("KEL", () => {
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
})

