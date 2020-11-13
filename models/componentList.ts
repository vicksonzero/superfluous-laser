import { PhaserComponent } from './components/PhaserComponent';
import { AbstractComponent, Def } from "./components/AbstractComponent";
import { EmptyComponent } from "./components/EmptyComponent";
import { HpBarComponent } from './components/HpBarComponent';
import { HpComponent } from './components/HpComponent';
import { InputStateComponent } from './components/InputStateComponent';
import { LocalPlayerComponent } from './components/LocalPlayerComponent';
import { NaiveMovementComponent } from './components/NaiveMovementComponent';
import { NetworkClientComponent } from "./components/NetworkClientComponent";
import { NetworkServerComponent } from './components/NetworkServerComponent';
import { PhysicsBodyComponent } from './components/PhysicsBodyComponent';
import { PickUpComponent } from './components/PickUpComponent';
import { RNGComponent } from "./components/RNGComponent";
import { SpriteComponent } from './components/SpriteComponent';
import { SpriteListComponent } from './components/SpriteListComponent';
import { TransformComponent } from './components/TransformComponent';


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
    Def<SpriteComponent> |
    Def<SpriteListComponent> |
    Def<PhaserComponent> |
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
    SpriteComponent,
    SpriteListComponent,
    PhaserComponent,
    EmptyComponent,
};

