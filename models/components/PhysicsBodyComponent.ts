import { b2Body, b2BodyDef, b2FixtureDef } from '@flyover/box2d';
import { AbstractComponent } from "./AbstractComponent";

export class PhysicsBodyComponent extends AbstractComponent {
    static type: "PhysicsBodyComponent";
    type = PhysicsBodyComponent.type;
    body: b2Body | null;
    fixtureDef: b2FixtureDef;
    bodyDef: b2BodyDef;
}
