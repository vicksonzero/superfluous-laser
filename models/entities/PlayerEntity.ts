import { ComponentDef } from '../componentList';
import { TransformComponent } from '../components/TransformComponent';

export function PlayerEntity(): ComponentDef[] {
    return [
        {
            type: TransformComponent.type,
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