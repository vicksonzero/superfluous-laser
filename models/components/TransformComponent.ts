import { AbstractComponent } from "./AbstractComponent";


export class TransformComponent extends AbstractComponent {
    type: "TransformComponent";
    x = 0;
    y = 0;
    rotation = 0; // in radians

}