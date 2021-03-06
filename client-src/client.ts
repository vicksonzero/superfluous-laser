import * as Debug from 'debug';
import "phaser";
import { WORLD_HEIGHT, WORLD_WIDTH } from '../models/constants';
import { PhysicsSystem } from '../models/systems/PhysicsSystem';
import { MainScene } from "./scenes/MainScene";
import { LoadingScene } from "./scenes/LoadingScene";
import '../utils/window';
import { Model } from '../models/Model';
import { networkClientSystem } from '../models/systems/networkClientSystem';
import { controllerStateSystem } from '../models/systems/controllerStateSystem';
import { spawnPlayerSystem } from '../models/systems/spawnPlayerSystem';
import { naiveMovementSystem } from '../models/systems/naiveMovementSystem';
import { spriteRenderer } from '../models/systems/spriteRenderer';
import { clientStartupSystem_ } from '../models/systems/clientStartupSystem';


window._Debug = Debug;
const verbose = Debug('superfluous-laser:client:verbose');
// const warn = Debug('superfluous-laser:client:warn');
// warn.log = console.warn.bind(console);


// main game configuration
const phaserConfig: Phaser.Types.Core.GameConfig = {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    disableContextMenu: true,
    type: Phaser.AUTO,
    parent: "game",
    scene: [
        LoadingScene,
        MainScene,
    ],
    zoom: 1,
    backgroundColor: 0xDDDDDD,
    // physics: {
    //     default: "matter",
    //     matter: {
    //         // debug: true,
    //         gravity: { x: 0, y: 0 },
    //     }
    // },
};

// game class
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.onload = () => {
    var game = new Game({ ...phaserConfig });
    const physicsSystem = new PhysicsSystem();
    const model = (window as any)._model = new Model();
    model.init([
        // networkClientSystem,
        clientStartupSystem_(game),
        spawnPlayerSystem,
        controllerStateSystem,
        naiveMovementSystem,
        spriteRenderer,
    ]);

    game.registry.merge({
        physicsSystem,
        model,
    });


    function handleSizeUpdate(event?: Event) {
        const ww = window.innerWidth / Number(phaserConfig.width);
        const hh = window.innerHeight / Number(phaserConfig.height);

        const min = Math.min(ww, hh);
        verbose(`handleSizeUpdate\n window: ${window.innerWidth}, ${window.innerHeight}\n ratio: ${ww}, ${hh}\n min: ${min}`);

        game.canvas.style.width = `${min * Number(phaserConfig.width)}px`;
        game.canvas.style.height = `${min * Number(phaserConfig.height)}px`;
    }

    if (!window.location.search.includes('video')) {
        window.addEventListener('resize', handleSizeUpdate);

        verbose('init handleSizeUpdate');
        handleSizeUpdate();
    }
};
