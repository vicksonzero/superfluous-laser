import { Component, ComponentDef, componentTypes } from "../componentList";


export type ComponentMap = Partial<{ [key in Component['type']]: Component[] }>;
export type SingletonComponentMap = Partial<{ [key in Component['type']]: number }>;

export class ComponentSystem {
    // private pointer = 0;
    private store: Component[];
    entityCounter = 0;

    names: string[];
    singletonCache: SingletonComponentMap;


    constructor() {
        this.store = [];
        this.names = [];
        this.singletonCache = {};
    }

    createEntity(name = 'entity', componentDefs: ComponentDef[] = []): number {
        const entityID = ++this.entityCounter;
        for (const componentDef of componentDefs) {
            this.add(entityID, componentDef);
        }
        this.names[entityID] = name;

        return entityID;
    }

    createSingletonEntity(name = 'single-entity', componentDef: ComponentDef): Component {
        const entityID = ++this.entityCounter;
        const componentID = this.add(entityID, componentDef);
        this.names[entityID] = name;

        return this.store[componentID]!;
    }

    add(entityID: number, def: ComponentDef | Component['type']): number {
        const componentID = this.store.length;
        const type = typeof def === "string" ? def : def.type;
        const ComponentCtor = componentTypes[type];
        const component = new ComponentCtor(componentID, entityID);

        if (typeof def !== "string") component.assign(def);

        // // TODO: don't do premature optimizing
        // this.pointer = this.binaryFindIndexFrom(entityID, this.pointer);
        // this.store.splice(this.pointer, 0, component);
        // this.clearSingletonCache();

        this.store.push(component);

        return componentID;
    }

    updateComponent(newData: Component) {
        const { entityID, type, componentID } = newData;

        // // TODO: don't do premature optimizing
        // const pointer = this.binaryFindIndexFrom(entityID, this.pointer);
        const pointer = this.binaryFindIndex(componentID);
        if (pointer === null) {
            throw new Error(`componentID "${componentID}" not found in store`);
        }
        // this.pointer = pointer;
        // this.movePointerToStartOfEntity();

        // const oldData = this.store[this.pointer];
        const oldData = this.store[pointer];

        if (oldData === newData) {
            throw new Error('if you call ComponentSystem.updateComponent(), you must clone() the component');
        }

        // this.store[this.pointer] = newData;
        this.store[pointer] = newData;
    }

    remove(componentID: number) {
        throw new Error('not yet implemented');
    }

    clearSingletonCache() {
        this.singletonCache = {};
    }

    getEntityName(entityID: number) {
        return this.names[entityID];
    }

    getSingletonComponent(type: Component['type']): Component {
        if (this.singletonCache[type] === undefined) {
            this.singletonCache[type] = this.store.findIndex(({ type: t }) => {
                return t === type;
            });
        }

        if (this.singletonCache[type] === -1) {
            const { name, def } = componentTypes[type].getDef();
            this.singletonCache[type] = this.createSingletonEntity(name, def).componentID;
        }

        return this.store[this.singletonCache[type]!];
    }

    getComponent(entityID: number, type: Component['type']) {
        return this.store.find(({ entityID: eID, type: t }) => {
            return eID === entityID && t === type;
        });
    }

    getComponents(entityID: number, type: Component['type']) {
        return this.store.filter(({ entityID: eID, type: t }) => {
            return eID === entityID && t === type;
        });
    }

    getComponentsByEntityID(entityID: number): ComponentMap {
        const buckets: ComponentMap = {};
        for (const component of this.store) {
            if (component.entityID === entityID) {
                var bucket = buckets[component.type] = buckets[component.type] ?? [];
                bucket.push(component);
            }
        }
        return buckets;
    }

    getComponentsByTypes(types: (Component['type'])[])
        : IterableIterator<[number, ComponentMap]> {
        const result = new Map<number, ComponentMap>();
        for (const component of this.store) {
            if (types.includes(component.type)) {
                var buckets = result.get(component.entityID) ?? {};
                var bucket = buckets[component.type] = buckets[component.type] ?? [];
                bucket.push(component);
                result.set(component.entityID, buckets);
            }
        }
        return result.entries();
    }

    binaryFindIndex(componentID: number): number | null {
        let start = 0;
        let end = this.store.length - 1;
        while (start <= end) {
            let mid = Math.floor((start + end) / 2);
            if (this.store[mid].componentID === componentID) {
                return componentID;
            } else if (this.store[mid].componentID < componentID) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        return null;
    }

    // binaryFindIndexFrom(entityID: number, from: number): number | null {
    //     let start = 0;
    //     let end = this.store.length - 1;

    //     if (from < start || from > end) return null;

    //     let mid = from;
    //     do {
    //         if (this.store[mid].entityID === entityID) {
    //             return entityID;
    //         } else if (this.store[mid].entityID < entityID) {
    //             start = mid + 1;
    //         } else {
    //             end = mid - 1;
    //         }
    //         mid = Math.floor((start + end) / 2);
    //     } while (start <= end);
    //     return null;
    // }

    // movePointerToStartOfEntity() {
    //     while (this.pointer > 0 &&
    //         this.store[this.pointer - 1].entityID === this.store[this.pointer].entityID) {
    //         this.pointer--;
    //     }
    // }

    // movePointerToEndOfEntity() {
    //     while (this.pointer > 0 &&
    //         this.store[this.pointer - 1].entityID === this.store[this.pointer].entityID) {
    //         this.pointer++;
    //     }
    // }

    // movePointerToStartOfType() {
    //     while (this.pointer > 0 &&
    //         this.store[this.pointer - 1].entityID === this.store[this.pointer].entityID &&
    //         this.store[this.pointer - 1].type === this.store[this.pointer].type) {
    //         this.pointer--;
    //     }
    // }

    toJSON() {
        return JSON.stringify(this.store);
    }
}

