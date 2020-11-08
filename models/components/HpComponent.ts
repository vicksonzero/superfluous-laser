import { AbstractComponent } from "./AbstractComponent";

export class HpComponent extends AbstractComponent {
    static type = 'HpComponent' as 'HpComponent';
    type = HpComponent.type;
    hp = 100;
    maxHP = 100;
}