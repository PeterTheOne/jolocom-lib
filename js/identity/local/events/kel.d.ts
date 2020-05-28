import { TEMP_EVENT } from "./icp";
export declare class KEL {
    private events;
    keyState: {
        keys: any[];
        threshold: number;
    };
    constructor(events?: TEMP_EVENT[]);
    update(ev: TEMP_EVENT): void;
    private apply;
    private validate;
}
