import { InputStateComponent } from "../components/InputStateComponent";
import { Model } from "../Model";
import { Def } from "../components/AbstractComponent";

import * as Debug from 'debug';
import { TransformComponent } from "../components/TransformComponent";
import { NaiveMovementComponent } from "../components/NaiveMovementComponent";
const verbose = Debug('superfluous-laser:naiveMovementSystem:verbose');
const log = Debug('superfluous-laser:naiveMovementSystem:log');

export function naiveMovementSystem(frameID: number, model: Model) {
    const { eventQueue, states } = model;

    moveATransform(frameID, model);
}


function moveATransform(frameID: number, { eventQueue, states }: Model) {
    const entities = states.getComponentsByTypes([
        NaiveMovementComponent.type,
        InputStateComponent.type,
        TransformComponent.type
    ]);

    for (const [entityID, componentSet] of entities) {
        const {
            NaiveMovementComponent: naiveMovements,
            InputStateComponent: inputStates,
            TransformComponent: transforms
        } = componentSet;
        const transform = transforms![0] as TransformComponent;
        const naiveMovement = naiveMovements![0] as NaiveMovementComponent;
        const speed = naiveMovement.speed;

        for (const inputState of inputStates as InputStateComponent[]) {
            const newState: Partial<Def<TransformComponent>> = {};
            let needChange = false;

            const moveVector = [0, 0];
            if (inputState.up === 'down' || inputState.up === 'hold') {
                needChange = true;
                moveVector[1] = -1;
            }
            if (inputState.down === 'down' || inputState.down === 'hold') {
                needChange = true;
                moveVector[1] = 1;
            }
            if (inputState.left === 'down' || inputState.left === 'hold') {
                needChange = true;
                moveVector[0] = -1;
            }
            if (inputState.right === 'down' || inputState.right === 'hold') {
                needChange = true;
                moveVector[0] = 1;
            }
            newState.x = transform.x + moveVector[0] * speed;
            newState.y = transform.y + moveVector[1] * speed;


            const aimVector = [0, 0];

            if (inputState.aimLeft === 'down' || inputState.aimLeft === 'hold') {
                needChange = true;
                aimVector[0] = -1;
            }
            if (inputState.aimRight === 'down' || inputState.aimRight === 'hold') {
                needChange = true;
                aimVector[0] = 1;
            }
            if (inputState.aimUp === 'down' || inputState.aimUp === 'hold') {
                needChange = true;
                aimVector[1] = -1;
            }
            if (inputState.aimDown === 'down' || inputState.aimDown === 'hold') {
                needChange = true;
                aimVector[1] = 1;
            }

            const directionVector = (aimVector[0] !== 0 || aimVector[1] !== 0) ? aimVector : moveVector;
            
            newState.angle = Math.atan2(directionVector[1], directionVector[0]) / Math.PI * 180 - 90;

            if (needChange) {
                const newComponent = new TransformComponent(inputState.componentID, inputState.entityID);
                newComponent.assign(
                    transform,
                    newState
                );

                states.updateComponent(newComponent);
            }
        }
    }
}

