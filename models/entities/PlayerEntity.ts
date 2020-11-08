import { ComponentDef } from '../componentList';

export function PlayerEntity(): ComponentDef[] {
    return [
        {
            type: 'TransformComponent',
            x: 0,
            y: 0,
            rotation: 0,
        },
        {
            type: 'PhysicsBodyComponent',
            body: null,
            fixtureDef: null,
            bodyDef: null,
        },
        {
            type: 'InputStateComponent',
            up: 'idle',
            down: 'idle',
            left: 'idle',
            right: 'idle',

            aimUp: 'idle',
            aimDown: 'idle',
            aimLeft: 'idle',
            aimRight: 'idle',

            action: 'idle',
        }
    ];
}