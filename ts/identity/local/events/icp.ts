// Mock data to start threading through the library
// see -- https://github.com/decentralized-identity/keri/blob/master/kids/kid0003.md#inception-event

const ICP_header = {
  vs: 'KERI_json_00fe_1.0',
  id: 'GA6NLmfIseQxONrKzwsNaNtsGIm5BxpL8gri1asHFQMW9',
  sn: 0, // TODO hex string
  ilk: 'icp',
}

const ICP_key_config = {
  ilk  : 'icp',
  sith : 1,  // TODO hex string no leading zeros
  keys : ["GA6NLmfIseQxONrKzwsNaNtsGIm5BxpL8gri1asHFQMW9"],
  next : "DZ-i0d8JZAoTNZH3ULvaU6JR2nmwyYAfSVPzhzS6b5CM",  // qualified Base64
}

const ICP_witness_config = {
  "toad" : 1,  // TODO hex string no leading zeros
  "wits" : [],
}

const OTHER_config = {
  data: []
}

const SIGNER_config = {
  sigs: [0] // TODO hex string no leading zeroes
}

export const ICP = {
  ...ICP_header,
  ...ICP_key_config,
  ...ICP_witness_config,
  ...OTHER_config,
  ...SIGNER_config
}

// TEMP type to not have to define
export type TEMP_EVENT = typeof ICP

