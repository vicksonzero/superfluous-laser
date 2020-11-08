import seedrandom from "seedrandom";

import { RNGComponent } from "../components/RNGComponent";
import { RNGAction } from "../eventList";
import { Model } from "../Model";

export function rngSystem(frameID: number, { eventQueue, states }: Model) {
    const events = eventQueue.getEventsOfFrame(frameID, 'rng') as RNGAction[];
    // if (events.length) console.log(frameID, JSON.stringify(events));

    for (const { value } of events) {
        let component = states.getSingletonComponent(RNGComponent.type) as RNGComponent;
        RNGComponent.setSeedString(component, value);

        states.updateComponent(component);
    }
}
