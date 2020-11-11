import { NaiveMovementComponent } from './components/NaiveMovementComponent';
import { LocalPlayerComponent } from './components/LocalPlayerComponent';
import { NetworkServerComponent } from './components/NetworkServerComponent';
import { AbstractComponent, Def } from "./components/AbstractComponent";
import { EmptyComponent } from "./components/EmptyComponent";
import { InputStateComponent } from './components/InputStateComponent';
import { PhysicsBodyComponent } from './components/PhysicsBodyComponent';
import { TransformComponent } from './components/TransformComponent';
import { PickUpComponent } from './components/PickUpComponent';
import { HpComponent } from './components/HpComponent';
import { HpBarComponent } from './components/HpBarComponent';
import { RNGComponent } from "./components/RNGComponent";
import { NetworkClientComponent } from "./components/NetworkClientComponent";


export type Component = AbstractComponent & ComponentDef;
export type ComponentDef = (
    Def<TransformComponent> |
    Def<InputStateComponent> |
    Def<PhysicsBodyComponent> |
    Def<PickUpComponent> |
    Def<HpComponent> |
    Def<HpBarComponent> |
    Def<NetworkClientComponent> |
    Def<NetworkServerComponent> |
    Def<RNGComponent> |
    Def<LocalPlayerComponent> |
    Def<NaiveMovementComponent> |
    Def<EmptyComponent>
); // union more types to complete the list

export const componentTypes = {
    TransformComponent,
    InputStateComponent,
    PhysicsBodyComponent,
    PickUpComponent,
    HpComponent,
    HpBarComponent,
    NetworkClientComponent,
    NetworkServerComponent,
    RNGComponent,
    LocalPlayerComponent,
    NaiveMovementComponent,
    EmptyComponent,
};

