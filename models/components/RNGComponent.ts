import * as seedrandom from "seedrandom";
import { AbstractComponent } from "./AbstractComponent";

export class RNGComponent extends AbstractComponent {
    static type = 'RNGComponent' as 'RNGComponent';
    type = RNGComponent.type;

    seedState: object;

    private _rng: seedrandom.prng;

    static setSeedString(component: RNGComponent, state: string) {
        component._rng = seedrandom(state, { state: true });
        component.seedState = component._rng.state();
    }

    static getRNG(component: RNGComponent) {
        if (!component._rng) component._rng = seedrandom('', { state: component.seedState });
        return component._rng;
    }

    static getDef() {
        const _rng = seedrandom(undefined, { state: true });

        const seedState = _rng.state();
        return {
            name: 'single-rng',
            def: {
                type: RNGComponent.type,
                seedState,
            }
        };
    }

    toJSON() {
        this.seedState = this._rng.state();
        return super.toJSON();
    }
    assign(obj: object) {
        Object.assign(this, obj);
    }
}
