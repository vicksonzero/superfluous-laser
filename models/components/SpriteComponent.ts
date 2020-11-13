import { AbstractComponent } from "./AbstractComponent";

type Image = Phaser.GameObjects.Image;


export class SpriteComponent extends AbstractComponent {
    static type = 'SpriteComponent' as 'SpriteComponent';
    type = SpriteComponent.type;
    key: string;
    frame: string;
    origin: { x: number, y: number };

    imageID?: number;
}
