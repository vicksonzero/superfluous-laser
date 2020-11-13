import { AbstractComponent } from "./AbstractComponent";

type Image = Phaser.GameObjects.Image;


export class SpriteListComponent extends AbstractComponent {
    static type = 'SpriteListComponent' as 'SpriteListComponent';
    type = SpriteListComponent.type;
    imageCount = 0;
    spriteList: { [x: number]: Image };
    removeList: number[];

    static create(component: SpriteListComponent) {
        return ++component.imageCount;
    }
    static remove(component: SpriteListComponent, imageID:number) {
        return component.removeList.push(imageID);
    }
}
