import type { MainScene } from './../../client-src/scenes/MainScene';
import { AbstractComponent } from "./AbstractComponent";


export class PhaserComponent extends AbstractComponent {
    static type = 'PhaserComponent' as 'PhaserComponent';
    type = PhaserComponent.type;
    phaser: Phaser.Game;

    toJSON() {
        return {
            componentID: this.componentID,
            entityID: this.entityID,
            type: this.type
        };
    }
}
