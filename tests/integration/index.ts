import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { EthResolver } from '../../ts/ethereum/ethereum'
import {
  createJolocomRegistry,
  JolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
import {
  createJolocomResolver,
  createValidatingIdentityResolver,
  instantiateIdentity,
  MultiResolver,
} from '../../ts/resolver'
import { publicKeyToDID, publicKeyToJoloDID } from '../../ts/utils/crypto'
import { keccak256 } from 'ethereumjs-util'
import { identityCreation } from './identity.integration'
import { ContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { ContractsGateway } from '../../ts/contracts/contractsGateway'
import { ethers } from 'ethers'
import {
  testEthereumConfig,
  testIpfsConfig,
  userVault,
  userPass,
  serviceVault,
  servicePass,
  testCustomEthereumConfig,
} from './integration.data'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { credentialOffer } from './credentialOffer.integration'
import { credentialShare } from './credentialShare.integration'
import { authenticationRequest } from './authentication.integration'
import { testCustomDeployments } from './customDeployment.integration'
import { noValidation } from '../../ts/utils/validation'
import { Identity } from '../../ts/identity/identity'
import {DidDocument} from '../../ts/identity/didDocument/didDocument'
const Web3 = require('web3')

chai.use(sinonChai)

const PORT = 8945
const web3 = new Web3()
web3.setProvider(new Web3.providers.HttpProvider(`http://localhost:${PORT}`))

export interface DependencyIndex {
  jolocomRegistry: JolocomRegistry
  customRegistry: JolocomRegistry
  userIdentityWallet: IdentityWallet
  serviceIdentityWallet: IdentityWallet
  contracts: Partial<{
    gateway: ContractsGateway
    adapter: ContractsAdapter
  }>
  resolver: MultiResolver
}

const mutatingDependencies: Partial<DependencyIndex> = {
  contracts: {},
}

before(async () => {
  await integrationHelper.init()

  const gateway = (mutatingDependencies.contracts.gateway = new ContractsGateway(
    new ethers.providers.Web3Provider(web3.currentProvider),
  ))

  const adapter = (mutatingDependencies.contracts.adapter = new ContractsAdapter())

  const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
  const ethereumConnector = new EthResolver(testEthereumConfig)
  const customDeploymentEthConnector = new EthResolver(testCustomEthereumConfig)

  const joloResolver = createValidatingIdentityResolver(
    createJolocomResolver(ethereumConnector, ipfsConnector),
  )(noValidation)(instantiateIdentity)

  const testResolver = createValidatingIdentityResolver(
    createJolocomResolver(customDeploymentEthConnector, ipfsConnector),
  )(noValidation)(({ didDocument }) =>
    Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDocument),
    }),
  )

  mutatingDependencies.resolver = new MultiResolver({
    jolo: joloResolver,
    test: testResolver,
  })

  const commonConfiguration = {
    ipfsConnector,
    contracts: { gateway, adapter },
  }

  const jolocomRegistry = (mutatingDependencies.jolocomRegistry = createJolocomRegistry(
    {
      ...commonConfiguration,
      ethereumConnector,
      didBuilder: publicKeyToJoloDID,
      didResolver: joloResolver,
    },
  ))

  mutatingDependencies.customRegistry = createJolocomRegistry({
    ...commonConfiguration,
    ethereumConnector: customDeploymentEthConnector,
    didBuilder: publicKeyToDID('test')(keccak256),
    didResolver: testResolver,
  })

  mutatingDependencies.userIdentityWallet = await jolocomRegistry.create(
    userVault,
    userPass,
  )

  mutatingDependencies.serviceIdentityWallet = await jolocomRegistry.create(
    serviceVault,
    servicePass,
  )
})

after(() => {
  process.exit(0)
})

describe(
  'Integration Test - Create, Resolve, Public Profile',
  identityCreation(mutatingDependencies).bind(this),
)

describe(
  'Integration Test - Token interaction flow Authentication',
  authenticationRequest(mutatingDependencies).bind(this),
)
describe(
  'Integration Test - Token interaction flow Credential Offer',
  credentialOffer(mutatingDependencies).bind(this),
)

describe(
  'Integration Test - EXPERIMENTAL Token interaction flow Payment',
  credentialOffer(mutatingDependencies).bind(this),
)

describe(
  'Integration Test - Token interaction flow Credential Request and Response',
  credentialShare(mutatingDependencies).bind(this),
)

describe(
  'Integration Test - Interacting with custom deployments',
  testCustomDeployments(mutatingDependencies).bind(this),
)