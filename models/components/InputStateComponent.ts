import { AbstractComponent } from "./AbstractComponent";

export type InputState = 'idle' | 'down' | 'hold' | 'up';

export class InputStateComponent extends AbstractComponent {
    static type: "InputStateComponent";
    type = InputStateComponent.type;
    up: InputState;
    down: InputState;
    left: InputState;
    right: InputState;
    aimUp: InputState;
    aimDown: InputState;
    aimLeft: InputState;
    aimRight: InputState;
    action: InputState;
}