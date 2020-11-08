import { AbstractComponent } from "./AbstractComponent";

export class NetworkClientComponent extends AbstractComponent {
    static type = "NetworkClientComponent" as 'NetworkClientComponent';
    type = NetworkClientComponent.type;

    isOpen = false;
    roomID: string = '';
    socketID: string = '';
    socket?: SocketIOClient.Socket;


    static getDef() {
        return {
            name: 'single-network',
            def: {
                type: 'NetworkClientComponent',
                isOpen: false,
            }
        };
    }
}
