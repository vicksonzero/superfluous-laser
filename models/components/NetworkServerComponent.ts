import { AbstractComponent } from "./AbstractComponent";
import { Socket, Server as ioServer } from 'socket.io';
import { Express } from 'express';

export class NetworkServerComponent extends AbstractComponent {
    static type = "NetworkServerComponent" as 'NetworkServerComponent';
    type = NetworkServerComponent.type;

    isOpen = false;
    roomID: string = '';
    socketID: string = '';
    socket?: Socket;
    io?: ioServer;
    port: number;
    app: Express;


    static getDef() {
        return {
            name: 'single-network',
            def: {
                type: 'NetworkServerComponent',
                isOpen: false,
            }
        };
    }
}
