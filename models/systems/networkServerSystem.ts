import * as Debug from 'debug';
import type { Request, Response } from 'express';
import * as express from 'express';
import { createServer } from 'http';
import { NetworkServerComponent } from "../components/NetworkServerComponent";
import { Model } from "../Model";
import { Server as ioServer, Socket } from 'socket.io';
import { AddressInfo } from 'net';


const verbose = Debug('superfluous-laser:networkServerSystem:verbose');
const log = Debug('superfluous-laser:networkServerSystem:log');
const incomingMessage = Debug('superfluous-laser:networkServerSystem:incomingMessage');


export function networkServerSystem(frameID: number, { states, eventQueue }: Model) {
    const component = states.getSingletonComponent(NetworkServerComponent.type) as NetworkServerComponent;
    const events = eventQueue.getEventsOfFrame(frameID);

    if (!component.isOpen) {
        log('Starting express...');

        const app = component.app = express();
        const server = createServer(app);
        const port = component.port = 3000;
        app.get('/', (req: Request, res: Response) => {
            res.json({ data: 'hello world' });
        });
        // server.listen(0, () => console.log(`Example app listening on port ${(server.address() as AddressInfo).port}!`));
        server.listen(port, () => log(`express listening on port ${(server.address() as AddressInfo).port}`));


        log('Starting socket.io...');
        const io = component.io = new ioServer(server, {
            cors: {
                origin: "http://127.0.0.1:8080",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        log('socket.io started');

        io.on('connection', (socket: Socket) => {
            log(`incoming connection ${socket.id}`);
            component.socket = socket;
            socket.on('message', (data) => {
                incomingMessage(data);
            });

            socket.on('disconnect', () => {
                /* … */
            });
        });

        component.isOpen = true;
    }
}

