import * as Debug from 'debug';
import type { Request, Response } from 'express';
import * as express from 'express';
import { createServer } from 'http';
import { NetworkServerComponent } from "../components/NetworkServerComponent";
import { Model } from "../Model";
import { Server as ioServer, Socket } from 'socket.io';
import { AddressInfo } from 'net';


const verbose = Debug('superfluous-laser:spawnPlayerSystem:verbose');
const log = Debug('superfluous-laser:spawnPlayerSystem:log');


export function spawnPlayerSystem(frameID: number, { states, eventQueue }: Model) {
    const component = states.getSingletonComponent(NetworkServerComponent.type) as NetworkServerComponent;
    const events = eventQueue.getEventsOfFrame(frameID);

    if (!component.isOpen) {
    }
}


