import { TEMP_EVENT } from './icp';
import { DidDocument } from '../../didDocument/didDocument';
export declare class KEL {
    private events;
    keyState: {
        keys: any[];
        threshold: number;
    };
    constructor(events?: TEMP_EVENT[]);
    update(ev: TEMP_EVENT): boolean;
    toDidDocument(): DidDocument;
    private apply;
    private validate;
}
