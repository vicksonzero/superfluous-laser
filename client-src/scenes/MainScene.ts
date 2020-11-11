import { config, ItemType } from '../../config/gameConfig';
import {
    BULLET_SPEED,
    DEBUG_DISABLE_SPAWNING,
    DEBUG_PHYSICS_BODIES,
    PHYSICS_FRAME_SIZE,
    PHYSICS_MAX_FRAME_CATCHUP,
    PIXEL_TO_METER,
    PLAYER_MOVE_SPEED,
    WORLD_HEIGHT,
    WORLD_WIDTH
} from '../../models/constants';

import * as Debug from 'debug';
import "phaser";
import { GameObjects } from 'phaser';

import {
    setUpAnimations as _setUpAnimations,
    setUpAudio as _setUpAudio,
    setUpPools as _setUpPools
} from '../assets';

import { CheatInputAction, InputAction, RNGAction } from '../../models/eventList';

import { HpBar } from '../ui/HpBar';
import { Model } from '../../models/Model';


type BaseSound = Phaser.Sound.BaseSound;
type Key = Phaser.Input.Keyboard.Key;
type Container = Phaser.GameObjects.Container;
type Graphics = Phaser.GameObjects.Graphics;
type Image = Phaser.GameObjects.Image;
type Group = Phaser.GameObjects.Group;

const Vector2 = Phaser.Math.Vector2;
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const verbose = Debug('superfluous-laser:MainScene:verbose');
const log = Debug('superfluous-laser:MainScene:log');
// const warn = Debug('superfluous-laser:MainScene:warn');
// warn.log = console.warn.bind(console);

export type Controls = { up: Key, down: Key, left: Key, right: Key, action: Key };


export class MainScene extends Phaser.Scene {

    controlsList: Controls[];
    cheats: { spawnUpgrades: Key };

    spawnTimer: Phaser.Time.TimerEvent;
    bg: Phaser.GameObjects.TileSprite;

    frameID = 0;

    backgroundUILayer: Container;
    factoryLayer: Container;
    itemLayer: Container;
    tankLayer: Container;
    playerLayer: Container;
    effectsLayer: Container;
    uiLayer: Container;
    physicsDebugLayer: Graphics;

    explosionPool: Group;

    btn_mute: Image;

    sfx_shoot: BaseSound;
    sfx_hit: BaseSound;
    sfx_navigate: BaseSound;
    sfx_point: BaseSound;
    sfx_open: BaseSound;
    sfx_bgm: BaseSound;

    frameSize = PHYSICS_FRAME_SIZE; // ms
    lastUpdate = -1;
    model: Model;
    fixedElapsedTime: number;
    fixedTime: Phaser.Time.Clock;

    get mainCamera() { return this.sys.cameras.main; }

    constructor() {
        super({
            key: "MainScene",
        })
    }

    preload() {
        log('preload');
        // _preload.call(this);
    }

    create(): void {
        _setUpPools.call(this);
        _setUpAnimations.call(this);
        _setUpAudio.call(this);
        log('create');
        this.model = this.registry.get('model') as Model;
        this.fixedTime = new Phaser.Time.Clock(this);
        this.fixedElapsedTime = this.fixedTime.now;

        // (window as any).save = () => {
        //     const result: any = {};
        //     result.input = [...this.systems.eventQueue.queue];
        //     result.replay = [...this.positionHistory];
        //     console.log(JSON.stringify(result));
        // };

        // this.bg = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'allSprites_default', 'tileGrass1');
        // this.bg.setOrigin(0, 0); 
        // this.bg.setAlpha(0.7);
        // this.bg.setTint(0xaaaaaa);

        this.backgroundUILayer = this.add.container(0, 0);
        this.itemLayer = this.add.container(0, 0);
        this.playerLayer = this.add.container(0, 0);
        this.effectsLayer = this.add.container(0, 0);
        this.uiLayer = this.add.container(0, 0);
        this.physicsDebugLayer = this.add.graphics({ lineStyle: { color: 0x000000, width: 1, alpha: 1 } });
        this.uiLayer.add(this.physicsDebugLayer);

        this.setUpGUI();
        this.setUpKeyboard();
        log('create complete');
    }

    update(time: number, dt: number) {
        // verbose(`update ${time}`);

        const lastGameTime = this.lastUpdate;
        // log(`update (from ${lastGameTime} to ${gameTime})`);

        if (this.lastUpdate === -1) {
            this.lastUpdate = time;

            // seconds
            this.frameID += 1;
            this.fixedElapsedTime += this.frameSize;
            this.model.fixedUpdate(this.frameID, this.fixedElapsedTime, this.frameSize);
        } else {
            let i = 0;
            while (this.lastUpdate + this.frameSize < time && i < PHYSICS_MAX_FRAME_CATCHUP) {
                i++;

                this.frameID += 1;
                this.fixedElapsedTime += this.frameSize;
                this.model.fixedUpdate(this.frameID, this.fixedElapsedTime, this.frameSize);
                this.lastUpdate += this.frameSize;
            }
            if (this.lastUpdate + this.frameSize < time) {

                // verbose(`${time - this.lastUpdate}ms skipped`);
                this.lastUpdate = time;
            }

            if (i > 1) { verbose(`${i - 1} frames skipped at frame-${this.frameID}`); }

            // verbose(`update: ${i} fixedUpdate-ticks at ${time.toFixed(3)} (from ${lastGameTime.toFixed(3)} to ${this.lastUpdate.toFixed(3)})`);
        }
    }

    setUpKeyboard() {
        this.cheats = {
            spawnUpgrades: this.input.keyboard.addKey(KeyCodes.ZERO),
        };
        this.controlsList = [
            {
                up: this.input.keyboard.addKey(KeyCodes.W),
                down: this.input.keyboard.addKey(KeyCodes.S),
                left: this.input.keyboard.addKey(KeyCodes.A),
                right: this.input.keyboard.addKey(KeyCodes.D),
                action: this.input.keyboard.addKey(KeyCodes.C),
            },
            {
                up: this.input.keyboard.addKey(KeyCodes.UP),
                down: this.input.keyboard.addKey(KeyCodes.DOWN),
                left: this.input.keyboard.addKey(KeyCodes.LEFT),
                right: this.input.keyboard.addKey(KeyCodes.RIGHT),
                action: this.input.keyboard.addKey(KeyCodes.FORWARD_SLASH),
            }
        ];
        this.bindInput();
    }

    setUpGUI() {
        this.uiLayer.add([
            this.btn_mute = this.add.image(WORLD_WIDTH - 64, 64, `btn_mute_${!this.sound.mute ? 'dark' : 'light'}`),
        ]);

        this.btn_mute.setInteractive();
        this.btn_mute.on('pointerup', () => {
            this.sound.mute = !this.sound.mute;
            this.btn_mute.setTexture(`btn_mute_${this.sound.mute ? 'dark' : 'light'}`);
        });
    }


    private bindInput() {
        (this.controlsList[0].up
            .on('down', (_: any) => { this.onCursorPressed('input', 0, 'up', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 0, 'up', 'up'); })
        );
        (this.controlsList[0].down
            .on('down', (_: any) => { this.onCursorPressed('input', 0, 'down', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 0, 'down', 'up'); })
        );
        (this.controlsList[0].left
            .on('down', (_: any) => { this.onCursorPressed('input', 0, 'left', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 0, 'left', 'up'); })
        );
        (this.controlsList[0].right
            .on('down', (_: any) => { this.onCursorPressed('input', 0, 'right', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 0, 'right', 'up'); })
        );
        (this.controlsList[0].action
            .on('down', (_: any) => { this.onCursorPressed('input', 0, 'action', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 0, 'action', 'up'); })
        );

        (this.controlsList[1].up
            .on('down', (_: any) => { this.onCursorPressed('input', 1, 'up', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 1, 'up', 'up'); })
        );
        (this.controlsList[1].down
            .on('down', (_: any) => { this.onCursorPressed('input', 1, 'down', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 1, 'down', 'up'); })
        );
        (this.controlsList[1].left
            .on('down', (_: any) => { this.onCursorPressed('input', 1, 'left', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 1, 'left', 'up'); })
        );
        (this.controlsList[1].right
            .on('down', (_: any) => { this.onCursorPressed('input', 1, 'right', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 1, 'right', 'up'); })
        );
        (this.controlsList[1].action
            .on('down', (_: any) => { this.onCursorPressed('input', 1, 'action', 'down'); })
            .on('up', (_: any) => { this.onCursorPressed('input', 1, 'action', 'up'); })
        );

        (this.cheats.spawnUpgrades
            .on('down', (_: any) => { this.onCheatPressed(); })
        );
    }

    onCursorPressed(type: InputAction['type'], who: number, key: InputAction['key'], value: InputAction['value']) {
        log('onCursorPressed');
        this.model.tryAddActionAt(this.frameID + 1, { type, isSync: true, who, key, value });
    }

    onCheatPressed() {

        this.model.tryAddActionAt(this.frameID + 1, { type: 'cheat-input', isSync: true, key: 'cheatSpawnUpgrades' })
    }
}
