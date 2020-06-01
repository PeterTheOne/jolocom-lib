import { IdentityWallet } from '../identityWallet/identityWallet';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { Identity } from '../identity/identity';
import { IRegistryCommitArgs, IRegistry } from './types';
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/types';
import { TEMP_EVENT } from '../identity/local/events/icp';
export declare class LocalRegistry implements IRegistry {
    private perspective;
    create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    commit(commitArgs: IRegistryCommitArgs): Promise<void>;
    resolve(did: string): Promise<Identity>;
    update(event: TEMP_EVENT): void;
    authenticate(vaultedKeyProvider: IVaultedKeyProvider, derivationArgs: IKeyDerivationArgs, did?: string): Promise<IdentityWallet>;
    fetchPublicProfile(hash: string): Promise<SignedCredential>;
}
export declare const createLocalRegistry: () => LocalRegistry;
