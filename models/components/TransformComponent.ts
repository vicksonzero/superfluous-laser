import { AbstractComponent } from "./AbstractComponent";


export class TransformComponent extends AbstractComponent {
    static type = 'TransformComponent' as 'TransformComponent';
    type = TransformComponent.type;
    x = 0;
    y = 0;
    rotation = 0; // in radians

}