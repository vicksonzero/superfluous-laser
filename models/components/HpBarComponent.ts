import { HpBar } from "../../client-src/ui/HpBar";
import { AbstractComponent } from "./AbstractComponent";

export class HpBarComponent extends AbstractComponent {
    static type: "HpBarComponent";
    type = HpBarComponent.type;
    hpBar: HpBar;
}
