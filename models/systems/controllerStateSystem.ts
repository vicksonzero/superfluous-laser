import { InputStateComponent } from "../components/InputStateComponent";
import { InputAction } from "../eventList";
import { Model } from "../Model";
import { LocalPlayerComponent } from "../components/LocalPlayerComponent";
import { Def } from "../components/AbstractComponent";

import * as Debug from 'debug';
const verbose = Debug('superfluous-laser:controllerStateSystem:verbose');
const log = Debug('superfluous-laser:controllerStateSystem:log');

export function controllerStateSystem(frameID: number, model: Model) {
    const { eventQueue, states } = model;

    advanceAllInputStates(frameID, model);
    registerNewInputStates(frameID, model);
}


function advanceAllInputStates(frameID: number, { eventQueue, states }: Model) {
    const inputStates = states.getComponentsByTypes([InputStateComponent.type]);
    for (const [entityID, { InputStateComponent: inputStateList }] of inputStates) {
        for (const s of inputStateList as InputStateComponent[]) {
            const newState: Partial<Def<InputStateComponent>> = {};
            let needChange = false;

            const keys = [
                'up' as 'up',
                'down' as 'down',
                'left' as 'left',
                'right' as 'right',
                'aimUp' as 'aimUp',
                'aimDown' as 'aimDown',
                'aimLeft' as 'aimLeft',
                'aimRight' as 'aimRight',
                'action' as 'action',
            ];
            for (const key of keys) {
                if (s[key] === 'down') {
                    newState[key] = 'hold' as 'hold';
                    needChange = true;
                }
                if (s[key] === 'up') {
                    newState[key] = 'idle' as 'idle';
                    needChange = true;
                }
            }

            if (needChange) {
                const newComponent = new InputStateComponent(s.componentID, s.entityID);
                newComponent.assign(
                    s,
                    newState
                );

                states.updateComponent(newComponent);
            }
        }
    }
}


function registerNewInputStates(frameID: number, { eventQueue, states }: Model) {
    const events = eventQueue.getEventsOfFrame(frameID, 'input') as InputAction[];
    if (events.length) log(frameID, JSON.stringify(events));
    const inputEntities = [...states.getComponentsByTypes([InputStateComponent.type, LocalPlayerComponent.type])];
    // if (inputEntities.length) log(frameID, JSON.stringify(inputEntities));

    for (const [entityID, { InputStateComponent: inputStateComponents }] of inputEntities) {
        const component = inputStateComponents![0] as InputStateComponent;
        const result = {

        } as Partial<Def<InputStateComponent>>
        for (const { who, key, value } of events) {
            // log(JSON.stringify(inputEntities));
            result[key] = value;


        }
        const newComponent = new InputStateComponent(component.componentID, component.entityID);
        newComponent.assign(
            component,
            result,
        );
        states.updateComponent(newComponent);
    }
}
