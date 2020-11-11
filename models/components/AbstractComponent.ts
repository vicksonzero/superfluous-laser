import { Component } from "../componentList";

export type Def<T> = Omit<T, keyof AbstractComponent>;

export abstract class AbstractComponent {
    isDirty = true;

    constructor(
        public componentID: number,
        public entityID: number
    ) { }

    // serialize
    toJSON() {
        return this;
    }
    assign(...obj: object[]) {
        Object.assign(this, ...obj);
    }

    toArrayBuffer() {
        return null;
    }

    fromArrayBuffer(buffer: ArrayBuffer) {

    }

    static getDef(): { name: string, def: any } {
        return {
            name: 'entity',
            def: {}
        };
    }
};