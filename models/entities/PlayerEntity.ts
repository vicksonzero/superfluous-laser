import { ComponentDef } from '../componentList';
import { SpriteComponent } from '../components/SpriteComponent';
import { TransformComponent } from '../components/TransformComponent';

export function PlayerEntity(x?: number, y?: number): ComponentDef[] {
    return [
        {
            type: TransformComponent.type,
            x: x ?? 0,
            y: y ?? 0,
            angle: 0,
        },
        {
            type: SpriteComponent.type,
            key: 'spaceShooter2_spritesheet',
            frame: 'spaceShips_001',
            origin: { x: 0.5, y: 0.5 },
        },
        // {
        //     type: 'PhysicsBodyComponent',
        //     body: null,
        //     fixtureDef: null,
        //     bodyDef: null,
        // },
        {
            type: 'NaiveMovementComponent',
            speed: 10,
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