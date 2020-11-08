import { HpBarComponent } from "../components/HpBarComponent";
import { HpComponent } from "../components/HpComponent";
import { Model } from "../Model";

export function hpRenderer(frameID: number, systems: Model) {
    const entities = systems.states.getComponentsByTypes([HpComponent.type, HpBarComponent.type]);

    for (const [entityID, components] of entities) {
        const hpComponent = components[HpComponent.type][0] as HpComponent;
        const hpBarComponent = components[HpBarComponent.type][0] as HpBarComponent;

        if (hpComponent.isDirty) {
            hpBarComponent.hpBar.updateHpBar(hpComponent.hp, hpComponent.maxHP);
        }
    }
}
