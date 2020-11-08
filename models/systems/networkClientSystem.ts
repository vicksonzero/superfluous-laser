import { NetworkClientComponent } from "../components/NetworkClientComponent";
import { Model } from "../Model";
import * as io from 'socket.io-client';

import * as Debug from 'debug';
const verbose = Debug('superfluous-laser:networkClientSystem:verbose');
const log = Debug('superfluous-laser:networkClientSystem:log');


export function networkClientSystem(frameID: number, { states, eventQueue }: Model) {
    const component = states.getSingletonComponent(NetworkClientComponent.type) as NetworkClientComponent;
    const events = eventQueue.getEventsOfFrame(frameID);

    if (!component.isOpen) {
        log('connecting...');

        const socket = io("http://127.0.0.1:3000");
        socket.once('connect', () => {
            log(`connected as ${socket.id}`);
            component.roomID = socket.id;
            socket.emit("message", "HELLO WORLD");

            // socket.on('state', (data) => {
            //     eventQueue.addActionAt();
            // });
        });
        component.socket = socket;
        component.isOpen = true;
    }
}


function connect() {

}

