
import { PhaserComponent } from "../components/PhaserComponent";
import { SpriteListComponent } from "../components/SpriteListComponent";
import { Model } from "../Model";

export const clientStartupSystem_ = (phaser: Phaser.Game) => (frameID: number, { eventQueue, states }: Model) => {
    if (states.hasSingletonComponent(PhaserComponent.type)) return;
    states.createEntity('phaser', [
        {
            type: PhaserComponent.type,
            phaser,
        },
        {
            type: SpriteListComponent.type,
            imageCount: 0,
            spriteList: {},
            removeList: [],
        }
    ]);

}
