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
        return this as any;
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

    static clone<T extends AbstractComponent>(ctor: new (componentID: number, entityID: number) => T, old: T) {
        const newObj = new ctor(old.componentID, old.entityID);
        newObj.assign(old);
        return newObj;
    }
};