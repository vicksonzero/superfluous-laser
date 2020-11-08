import * as Debug from 'debug';
import type { Request, Response } from 'express';
import * as express from 'express';
import { createServer } from 'http';
import { NetworkServerComponent } from "../components/NetworkServerComponent";
import { Model } from "../Model";
import { Server as ioServer, Socket } from 'socket.io';


const verbose = Debug('superfluous-laser:serverEventQueueSystem:verbose');
const log = Debug('superfluous-laser:serverEventQueueSystem:log');


export function serverEventQueueSystem(frameID: number, { states, eventQueue }: Model) {
    const component = states.getSingletonComponent(NetworkServerComponent.type) as NetworkServerComponent;
    const events = eventQueue.getEventsOfFrame(frameID);

    if (!component.isOpen) return;

    const { socket } = component;
    if (!socket) return;

    for (const event of events) {
        socket.emit('eq', event);
    }
}


function connect() {

}

