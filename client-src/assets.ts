import { AUDIO_START_MUTED } from "../models/constants";
import { Explosion } from "./gameObjects/Explosion";
import { MainScene } from "./scenes/MainScene";
import * as Debug from 'debug';

import * as assetsObj from '../assets/assets.json';

type Group = Phaser.GameObjects.Group;


const verbose = Debug('superfluous-laser:assets:verbose');
const log = Debug('superfluous-laser:assets:log');
// const warn = Debug('superfluous-laser:assets:warn');
// warn.log = console.warn.bind(console);


export function preload(this: Phaser.Scene) {
    log('preload');
    // this.load.json('sheetMap', url);


    this.load.addPack(assetsObj);
}

export function setUpAnimations(this: Phaser.Scene) {
    log('setUpAnimations');
    this.anims.create({
        key: 'explosion',
        frames: this.anims.generateFrameNames(
            'allSprites_default',
            {
                prefix: 'explosion',
                start: 1,
                end: 5,

            },
        ),
        repeat: 0,
        frameRate: 10,
    });
}

export function setUpPools(this: MainScene) {
    log('setUpPools');
    // this.iconPool = this.add.group({
    //     classType: ItemIcon,
    //     runChildUpdate: false,
    //     name: 'pool-item-icon',
    //     createCallback: function (this: Group, entity: ItemIcon) {
    //         entity.setName(`${this.name}-${this.getLength()}`);
    //         // console.log(`${this.name}: ${this.getLength()} Created`);
    //     },
    //     removeCallback: function (this: Group, entity: ItemIcon) {
    //         // place holder
    //         // console.log(`${this.name}: Removed`);
    //         // debugger; // uncomment to debug accidental destroys instead of .setActive(false).setVisible(false)
    //     }
    // });
    this.explosionPool = this.add.group({
        classType: Explosion,
        runChildUpdate: false,
        name: 'pool-effect-explosion',
        createCallback: function (this: Group, entity: Explosion) {
            entity.setName(`${this.name}-${this.getLength()}`);
            // console.log(`${this.name}: ${this.getLength()} Created`);
        },
        removeCallback: function (this: Group, entity: Explosion) {
            // place holder
            // console.log(`${this.name}: Removed`);
            // debugger; // uncomment to debug accidental destroys instead of .setActive(false).setVisible(false)
        }
    });
}

export function setUpAudio(this: MainScene) {
    log('setUpAudio');
    // this.sfx_bgm = this.sound.add('bgm', {
    //     mute: false,
    //     volume: 0.7,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: true, // loop!!!
    //     delay: 0
    // });
    // this.sfx_shoot = this.sound.add('shoot', {
    //     mute: false,
    //     volume: 0.4,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    // });
    // this.sfx_hit = this.sound.add('hit', {
    //     mute: false,
    //     volume: 0.7,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    // });
    // this.sfx_navigate = this.sound.add('navigate', {
    //     mute: false,
    //     volume: 0.8,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    // });
    // this.sfx_point = this.sound.add('point', {
    //     mute: false,
    //     volume: 0.8,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    // });
    // this.sfx_open = this.sound.add('open', {
    //     mute: false,
    //     volume: 1,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    // });

    this.sound.mute = AUDIO_START_MUTED;
}