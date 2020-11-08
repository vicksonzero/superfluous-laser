import { PhysicsBodyComponent } from '../components/PhysicsBodyComponent';
import { InputStateComponent } from '../components/InputStateComponent';
import { TransformComponent } from "../components/TransformComponent";
import { ComponentDef } from "../componentList";

export function PlayerEntity(): ComponentDef[] {
    return [
        {
            type: 'TransformComponent',
            x: 0,
            y: 0,
            rotation: 0,
        } as TransformComponent,
        {
            type: 'PhysicsBodyComponent',
            body: null,
            fixtureDef: null,
            bodyDef: null,
        } as PhysicsBodyComponent,
        {
            type: 'InputStateComponent',
            up: 'idle',
            down: 'idle',
            left: 'idle',
            right: 'idle',
            action: 'idle',
        } as InputStateComponent,
    ];
}