import { AbstractComponent } from "./AbstractComponent";

type Image = Phaser.GameObjects.Image;


export class SpriteComponent extends AbstractComponent {
    static type: "SpriteComponent";
    type = SpriteComponent.type;
    bodySprite: Image;
}
