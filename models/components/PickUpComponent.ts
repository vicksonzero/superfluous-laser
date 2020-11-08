import { AbstractComponent } from "./AbstractComponent";


// interface HoldingItem extends Container {
//     upgrades?: UpgradeObject;
// }

export class PickUpComponent extends AbstractComponent {
    static type: "PickUpComponent";
    type = PickUpComponent.type;
    armLength = 30;
    armRadius = 20;
    pointerTarget: number | null = null;
    // holdingItem: HoldingItem | null; // reserved for renderer
    // holdingItemContainer: Container; // reserved for renderer
}