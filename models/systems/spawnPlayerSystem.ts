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


const verbose = Debug('superfluous-laser:spawnPlayerSystem:verbose');
const log = Debug('superfluous-laser:spawnPlayerSystem:log');


export function spawnPlayerSystem(frameID: number, model: Model) {
    const { states, eventQueue } = model;
    const hasNetworkClient = states.hasSingletonComponent(NetworkClientComponent.type);

    if (hasNetworkClient) {
        spawnNetworkPlayerIfNeeded(frameID, model);
    } else {
        spawnSinglePlayer(model);
    }
}



function spawnNetworkPlayerIfNeeded(frameID: number, { states, eventQueue }: Model) {
    const events = eventQueue.getEventsOfFrame(frameID, 'connection') as ConnectionAction[];

    for (const { who, value } of events) {
        if (value === 'connect') {
            const playerID = states.createEntity('player', PlayerEntity());
            states.add(playerID, {
                type: 'LocalPlayerComponent',
            });
        }
    }
}


function spawnSinglePlayer({ states }: Model) {
    const localPlayerComponent = [...states.getComponentsByTypes([LocalPlayerComponent.type])];
    if (localPlayerComponent.length > 0) return;
    const playerID = states.createEntity('player', PlayerEntity());
    states.add(playerID, {
        type: LocalPlayerComponent.type,
    });
}