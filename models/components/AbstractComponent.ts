import { Component } from "../componentList";

export type Def<T> = Omit<T, keyof AbstractComponent>;

export abstract class AbstractComponent {
    isDirty = true;

    constructor(
        public componentID: number,
        public entityID: number
    ) { }

    toJSON() {
        return JSON.stringify(this);
    }
    assign(obj: object) {
        Object.assign(this, obj);
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