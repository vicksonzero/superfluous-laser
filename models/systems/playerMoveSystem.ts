import { InputStateComponent } from "../components/InputStateComponent";
import { InputAction } from "../eventList";
import { Model } from "../Model";

export function playerMoveSystem(frameID: number, { eventQueue, states }: Model) {
    const events = eventQueue.getEventsOfFrame(frameID, 'input') as InputAction[];
    // if (events.length) console.log(frameID, JSON.stringify(events));
    const entities = [...states.getComponentsByTypes([InputStateComponent.type])];

    for (const { who, key, value } of events) {
        const entity = entities.find(([entityID]) => entityID === who);
        if (entity) {
            const [entityID, { InputStateComponent: inputStateComponents }] = entity;
            const component = inputStateComponents[0] as InputStateComponent;
            const newComponent = new InputStateComponent(component.componentID, component.entityID);

            states.updateComponent(component);
        }
    }
}
