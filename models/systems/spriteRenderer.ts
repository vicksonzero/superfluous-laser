import * as Debug from 'debug';
import type { Request, Response } from 'express';
import * as express from 'express';
import { createServer } from 'http';
import { Model } from "../Model";
import { Server as ioServer, Socket } from 'socket.io';
import { AddressInfo } from 'net';
import { ConnectionAction } from '../eventList';
import { PlayerEntity } from '../entities/PlayerEntity';
import { NetworkClientComponent } from '../components/NetworkClientComponent';
import { LocalPlayerComponent } from '../components/LocalPlayerComponent';
import { SpriteListComponent } from '../components/SpriteListComponent';
import { SpriteComponent } from '../components/SpriteComponent';
import { TransformComponent } from '../components/TransformComponent';
import { PhaserComponent } from '../components/PhaserComponent';
import { MainScene } from '../../client-src/scenes/MainScene';


const verbose = Debug('superfluous-laser:spriteRenderer:verbose');
const log = Debug('superfluous-laser:spriteRenderer:log');


export function spriteRenderer(frameID: number, model: Model) {
    const { states, eventQueue } = model;
    const { phaser } = states.getSingletonComponent<PhaserComponent>(PhaserComponent.type);
    const spriteListComponent = states.getSingletonComponent<SpriteListComponent>(SpriteListComponent.type);
    const { spriteList, removeList } = spriteListComponent;
    const spriteEntities = states.getComponentsByTypes([SpriteComponent.type, TransformComponent.type]);

    if (!phaser.scene.isActive('MainScene')) return;

    const mainScene = phaser.scene.getScene('MainScene') as MainScene;

    for (const removeImageID of removeList) {
        if (!spriteList[removeImageID]) continue;

        // TODO: change to use Object Pool if the number is huge
        spriteList[removeImageID].destroy();
    }
    for (const entity of spriteEntities) {
        const [entityID, { SpriteComponent: spriteComponents, TransformComponent: transformComponents }] = entity;
        const { x, y, angle } = transformComponents![0] as TransformComponent;
        for (const sprite of spriteComponents as SpriteComponent[]) {
            const { imageID, key, frame, origin } = sprite;
            let _imageID = imageID;

            if (_imageID == null) {
                _imageID = SpriteListComponent.create(spriteListComponent);
                sprite.imageID = _imageID;
                states.updateComponent(SpriteComponent.clone(SpriteComponent, sprite));
            }
            if (!spriteList[_imageID]) {
                spriteList[_imageID] = mainScene.add.image(x, y, key, frame).setAngle(angle).setOrigin(origin.x, origin.y);
                states.updateComponent(SpriteListComponent.clone(SpriteListComponent, spriteListComponent));
            } else {
                spriteList[_imageID].setPosition(x, y).setAngle(angle).setOrigin(origin.x, origin.y);
            }
        }
    }
}


