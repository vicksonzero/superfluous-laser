
import { b2Body, b2BodyType, b2CircleShape, b2Contact, b2ContactImpulse, b2ContactListener, b2Fixture, b2JointType, b2Manifold, b2ParticleBodyContact, b2ParticleContact, b2ParticleSystem, b2PolygonShape, b2Shape, b2ShapeType, b2World, XY } from "@flyover/box2d";
import * as Debug from 'debug';
import { GameObjects } from "phaser";
import { METER_TO_PIXEL, PHYSICS_ALLOW_SLEEPING, PIXEL_TO_METER } from "../constants";


const verbose = Debug('superfluous-laser:PhysicsSystem:verbose');
const log = Debug('superfluous-laser:PhysicsSystem:log');
// const warn = Debug('superfluous-laser:PhysicsSystem:warn');
// warn.log = console.warn.bind(console);

export type CreateBodyCallback = (world: b2World) => void;

export interface IBodyUserData {
    label: string;
    gameObject: GameObjects.Components.Transform;
}

export interface IFixtureUserData {
    fixtureLabel: string;
}

export class PhysicsSystem implements b2ContactListener {

    world: b2World;
    scheduledCreateBodyList: CreateBodyCallback[] = [];
    scheduledDestroyBodyList: b2Body[] = [];

    constructor(public gravity: XY = { x: 0, y: 0 }) {
        this.world = new b2World(gravity);
    }

    init() {
        this.world.SetAllowSleeping(PHYSICS_ALLOW_SLEEPING);
        this.world.SetContactListener(this);
    }

    update(timeStep: number, graphics?: Phaser.GameObjects.Graphics) {
        this.destroyScheduledBodies('before Step');
        this.readStateFromGame();
        if (graphics) { this.debugDraw(graphics); }
        // verbose('Begin updateToFrame');
        this.stepPhysicsWorld(timeStep);
        this.destroyScheduledBodies('after Step');
        // verbose('End updateToFrame');
        this.createScheduledBodies();
        this.writeStateIntoGame();
    }

    scheduleCreateBody(callback: CreateBodyCallback) {
        this.scheduledCreateBodyList.push(callback);
    }

    scheduleDestroyBody(body: b2Body) {
        this.scheduledDestroyBodyList.push(body);
    }

    private readStateFromGame() {
        const verboseLogs: string[] = [];
        for (let body = this.world.GetBodyList(); body; body = body.GetNext()) {
            const userData: IBodyUserData = body.GetUserData(); // TODO: make an interface for user data
            const gameObject: GameObjects.Components.Transform = userData.gameObject || null;
            const label = userData.label || '(no label)';
            const name = (gameObject as any).name || '(no name)';

            if (!gameObject) { continue; }
            verboseLogs.push(`Body ${label} ${name}`);

            body.SetPosition({
                x: gameObject.x * PIXEL_TO_METER,
                y: gameObject.y * PIXEL_TO_METER,
            });
            body.SetAngle(gameObject.rotation);
        }
        // verbose('readStateFromGame\n' + verboseLogs.join('\n'));
    }

    private writeStateIntoGame() {
        const verboseLogs: string[] = [];
        for (let body = this.world.GetBodyList(); body; body = body.GetNext()) {
            const userData: IBodyUserData = body.GetUserData();
            const gameObject: GameObjects.Components.Transform = userData.gameObject || null;
            const label = userData?.label || '(no label)';
            const name = (gameObject as any)?.name || '(no name)';

            if (!gameObject) { continue; }
            verboseLogs.push(`${name}'s body ${label}`);

            const pos = body.GetPosition();
            const rot = body.GetAngle(); // radians
            gameObject.x = pos.x * METER_TO_PIXEL;
            gameObject.y = pos.y * METER_TO_PIXEL;
            gameObject.setRotation(rot);
        }
        // verbose('writeStateIntoGame\n' + verboseLogs.join('\n'));
    }

    private stepPhysicsWorld(timeStep: number) {
        const velocityIterations = 10;   //how strongly to correct velocity
        const positionIterations = 10;   //how strongly to correct position
        this.world.Step(timeStep, velocityIterations, positionIterations);
    }

    private createScheduledBodies() {
        const len = this.scheduledCreateBodyList.length;
        if (len > 0) {
            // log(`createScheduledBodies: ${len} callbacks`);
        }
        this.scheduledCreateBodyList.forEach((callback) => {
            callback(this.world);
        });
        this.scheduledCreateBodyList = [];
    }

    private destroyScheduledBodies(debugString: string) {
        const len = this.scheduledDestroyBodyList.length;
        if (len > 0) {
            // log(`destroyScheduledBodies(${debugString}): ${len} callbacks`);
        }
        this.scheduledDestroyBodyList.forEach((body) => {
            this.world.DestroyBody(body);
        });
        this.scheduledDestroyBodyList = [];
    }

    private debugDraw(graphics: Phaser.GameObjects.Graphics) {
        // see node_modules/@flyover/box2d/Box2D/Dynamics/b2World.js DrawDebugData() 
        // for more example of drawing debug data onto screen
        graphics.clear();
        this.drawBodies(graphics);
        this.drawJoints(graphics);
    }

    private drawBodies(graphics: Phaser.GameObjects.Graphics) {
        for (let body = this.world.GetBodyList(); body; body = body.GetNext()) {
            const pos = body.GetPosition();
            const angle = body.GetAngle(); // radian

            for (let fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
                const shape = fixture.GetShape();
                const type = shape.GetType();
                const isSensor = fixture.IsSensor();
                const fixtureLabel = (fixture.GetUserData() as IFixtureUserData).fixtureLabel;

                let color = 0xff8080;

                if (!body.IsActive()) {
                    color = 0x80804c;
                }
                else if (body.GetType() === b2BodyType.b2_staticBody) {
                    color = 0x80e580;
                }
                else if (body.GetType() === b2BodyType.b2_kinematicBody) {
                    color = 0x8080e5;
                }
                else if (!body.IsAwake()) {
                    color = 0x999999;
                }
                else {
                    color = 0xe6b2b2; // 0xf29999;
                }

                const alpha = isSensor ? 0 : 0.5;
                graphics.lineStyle(2, color, 1);
                graphics.fillStyle(color, alpha);

                switch (type) {
                    case b2ShapeType.e_circleShape:
                        {
                            const circleShape = shape as b2CircleShape;
                            const p = circleShape.m_p;
                            const r = circleShape.m_radius;

                            graphics.strokeCircle((pos.x + p.x) * METER_TO_PIXEL, (pos.y + p.y) * METER_TO_PIXEL, r * METER_TO_PIXEL);
                            graphics.fillCircle((pos.x + p.x) * METER_TO_PIXEL, (pos.y + p.y) * METER_TO_PIXEL, r * METER_TO_PIXEL);
                            graphics.lineBetween(
                                (pos.x + p.x) * METER_TO_PIXEL, (pos.y + p.y) * METER_TO_PIXEL,
                                (pos.x + p.x + Math.cos(angle) * r) * METER_TO_PIXEL, (pos.y + p.y + Math.sin(angle) * r) * METER_TO_PIXEL
                            );
                        } break;
                    case b2ShapeType.e_polygonShape:
                        {
                            const polygonShape = shape as b2PolygonShape;
                            const vertices = polygonShape.m_vertices;
                            graphics.beginPath();
                            vertices.forEach((v, i) => {
                                if (i === 0) {
                                    graphics.moveTo(
                                        (pos.x + v.x) * METER_TO_PIXEL,
                                        (pos.y + v.y) * METER_TO_PIXEL
                                    );
                                } else {
                                    graphics.lineTo(
                                        (pos.x + v.x) * METER_TO_PIXEL,
                                        (pos.y + v.y) * METER_TO_PIXEL
                                    );
                                }
                            });
                            graphics.closePath();
                            graphics.strokePath();
                            graphics.fillPath();
                        } break;
                }
            }
        }
    }

    private drawJoints(graphics: Phaser.GameObjects.Graphics) {
        for (let joint = this.world.GetJointList(); joint; joint = joint.GetNext()) {
            const color = 0x81cccc;
            graphics.lineStyle(2, color, 1);
            const type = joint.GetType();
            const label = joint.GetUserData()?.label || '';

            const bodyA = joint.GetBodyA();
            const bodyB = joint.GetBodyB();
            const xf1 = bodyA.m_xf;
            const xf2 = bodyB.m_xf;
            const x1 = xf1.p;
            const x2 = xf2.p;
            const p1 = joint.GetAnchorA({ x: 0, y: 0 });
            const p2 = joint.GetAnchorB({ x: 0, y: 0 });

            switch (type) {
                case b2JointType.e_distanceJoint:
                    {
                        graphics.lineBetween(
                            (p1.x) * METER_TO_PIXEL, (p1.y) * METER_TO_PIXEL,
                            (p2.x) * METER_TO_PIXEL, (p2.y) * METER_TO_PIXEL
                        );
                    } break;
                default:
                    {
                        graphics.lineBetween(
                            (x1.x) * METER_TO_PIXEL, (x1.y) * METER_TO_PIXEL,
                            (p1.x) * METER_TO_PIXEL, (p1.y) * METER_TO_PIXEL
                        );
                        graphics.lineBetween(
                            (p1.x) * METER_TO_PIXEL, (p1.y) * METER_TO_PIXEL,
                            (p2.x) * METER_TO_PIXEL, (p2.y) * METER_TO_PIXEL
                        );
                        graphics.lineBetween(
                            (x2.x) * METER_TO_PIXEL, (x2.y) * METER_TO_PIXEL,
                            (p2.x) * METER_TO_PIXEL, (p2.y) * METER_TO_PIXEL
                        );
                    }
            }
        }
    }



    public BeginContact(pContact: b2Contact<b2Shape, b2Shape>): void {
        for (let contact: b2Contact<b2Shape, b2Shape> | null = pContact; contact != null; contact = contact.GetNext()) {
            if (!contact) { continue; } // satisfy eslint
            const fixtureA = contact.GetFixtureA();
            const fixtureB = contact.GetFixtureB();

            const fixtureDataA: IFixtureUserData = contact.GetFixtureA()?.GetUserData();
            const fixtureDataB: IFixtureUserData = contact.GetFixtureB()?.GetUserData();

            const bodyDataA: IBodyUserData = fixtureA.GetBody()?.GetUserData();
            const bodyDataB: IBodyUserData = fixtureB.GetBody()?.GetUserData();

            const gameObjectA = fixtureA.GetBody()?.GetUserData()?.gameObject;
            const gameObjectB = fixtureB.GetBody()?.GetUserData()?.gameObject;
            // log(`BeginContact ` +
            //     `${bodyDataA?.label}(${gameObjectA?.uniqueID})'s ${fixtureDataA?.fixtureLabel}` +
            //     ` vs ` +
            //     `${bodyDataB?.label}(${gameObjectB?.uniqueID})'s ${fixtureDataB?.fixtureLabel}`
            // );

            const checkPairGameObjectName = this.checkPairGameObjectName_(fixtureA, fixtureB);
            const checkPairFixtureLabels = this.checkPairFixtureLabels_(fixtureA, fixtureB);

            // checkPairFixtureLabels('player-hand', 'tank-body', (a: b2Fixture, b: b2Fixture) => {
            //     log('do contact 1');
            //     (<Player>a.GetBody()?.GetUserData()?.gameObject).onTouchingTankStart(a, b, contact!);
            // });
            // if (fixtureA.GetBody()?.GetUserData()?.gameObject == null || fixtureB.GetBody()?.GetUserData()?.gameObject == null) {
            //     log('gone 1');
            //     continue;
            // }

            // checkPairFixtureLabels('player-hand', 'item-body', (a: b2Fixture, b: b2Fixture) => {
            //     log('do contact 2');
            //     (<Player>a.GetBody()?.GetUserData()?.gameObject).onTouchingItemStart(a, b, contact!);
            // });
            // if (fixtureA.GetBody()?.GetUserData()?.gameObject == null || fixtureB.GetBody()?.GetUserData()?.gameObject == null) {
            //     log('gone 2');
            //     continue;
            // }

            checkPairGameObjectName('tank', 'item', (tankFixture: b2Fixture, itemFixture: b2Fixture) => {
                // log('do contact 3');
                // const tank: Tank = tankFixture.GetBody()?.GetUserData()?.gameObject as Tank;
                // const item: Item = itemFixture.GetBody()?.GetUserData()?.gameObject as Item;
            });
            if (fixtureA.GetBody()?.GetUserData()?.gameObject == null || fixtureB.GetBody()?.GetUserData()?.gameObject == null) {
                // log('gone 3');
                continue;
            }

            checkPairGameObjectName('tank', 'bullet', (tankFixture: b2Fixture, bulletFixture: b2Fixture) => {
                // log('do contact 3');
                // const tank: Tank = tankFixture.GetBody()?.GetUserData()?.gameObject as Tank;
                // const bullet: Bullet = bulletFixture.GetBody()?.GetUserData()?.gameObject as Bullet;
            });
            if (fixtureA.GetBody()?.GetUserData()?.gameObject == null || fixtureB.GetBody()?.GetUserData()?.gameObject == null) {
                // log('gone 3');
                continue;
            }

            checkPairFixtureLabels('player-body', 'bullet-body', (playerFixture: b2Fixture, bulletFixture: b2Fixture) => {
                // log('do contact 4');
                // const player: Player = playerFixture.GetBody()?.GetUserData()?.gameObject as Player;
                // const bullet: Bullet = bulletFixture.GetBody()?.GetUserData()?.gameObject as Bullet;
            });
            if (fixtureA.GetBody()?.GetUserData()?.gameObject == null || fixtureB.GetBody()?.GetUserData()?.gameObject == null) {
                // log('gone 4');
                continue;
            }

            // checkPairGameObjectName('player_bullet', 'enemy', (a: b2Fixture, b: b2Fixture) => {
            //     // (<PlayerBullet>a.gameObject).onHitEnemy(b.gameObject, activeContacts as IMatterContactPoints);
            // });
        }
    }
    public EndContact(pContact: b2Contact<b2Shape, b2Shape>): void {
        for (let contact: b2Contact<b2Shape, b2Shape> | null = pContact; contact != null; contact = contact.GetNext()) {
            if (!contact) { continue; } // satisfy eslint
            const fixtureA = contact.GetFixtureA();
            const fixtureB = contact.GetFixtureB();

            const fixtureDataA: IFixtureUserData = contact.GetFixtureA()?.GetUserData();
            const fixtureDataB: IFixtureUserData = contact.GetFixtureB()?.GetUserData();

            const bodyDataA: IBodyUserData = fixtureA.GetBody()?.GetUserData();
            const bodyDataB: IBodyUserData = fixtureB.GetBody()?.GetUserData();

            const gameObjectA = fixtureA.GetBody()?.GetUserData()?.gameObject;
            const gameObjectB = fixtureB.GetBody()?.GetUserData()?.gameObject;
            // log(`EndContact ` +
            //     `${bodyDataA?.label}(${gameObjectA?.uniqueID})'s ${fixtureDataA?.fixtureLabel}` +
            //     ` vs ` +
            //     `${bodyDataB?.label}(${gameObjectB?.uniqueID})'s ${fixtureDataB?.fixtureLabel}`
            // );


            const checkPairGameObjectName = this.checkPairGameObjectName_(fixtureA, fixtureB);
            const checkPairFixtureLabels = this.checkPairFixtureLabels_(fixtureA, fixtureB);

            // checkPairFixtureLabels('player-hand', 'tank-body', (a: b2Fixture, b: b2Fixture) => {
            //     (<Player>a.GetBody()?.GetUserData()?.gameObject).onTouchingTankEnd(a, b, contact!);
            // });

            // checkPairFixtureLabels('player-hand', 'item-body', (a: b2Fixture, b: b2Fixture) => {
            //     (<Player>a.GetBody()?.GetUserData()?.gameObject).onTouchingItemEnd(a, b, contact!);
            // });


            // checkPairGameObjectName('player_bullet', 'enemy', (a: b2Fixture, b: b2Fixture) => {
            //     // (<PlayerBullet>a.gameObject).onHitEnemy(b.gameObject, activeContacts as IMatterContactPoints);
            // });
        }
    }

    public BeginContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void {
        // do nothing
    }
    public EndContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void {
        // do nothing
    }
    public BeginContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void {
        // do nothing
    }
    public EndContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void {
        // do nothing
    }
    public PreSolve(contact: b2Contact<b2Shape, b2Shape>, oldManifold: b2Manifold): void {
        // do nothing
    }
    public PostSolve(contact: b2Contact<b2Shape, b2Shape>, impulse: b2ContactImpulse): void {
        // do nothing
    }

    private checkPairGameObjectName_(fixtureA: b2Fixture, fixtureB: b2Fixture) {
        const gameObjectA = fixtureA?.GetBody()?.GetUserData()?.gameObject;
        const gameObjectB = fixtureB?.GetBody()?.GetUserData()?.gameObject;

        return (
            nameA: string, nameB: string,
            matchFoundCallback: (a: b2Fixture, b: b2Fixture) => void
        ) => {
            if (gameObjectA?.name === nameA && gameObjectB?.name === nameB) {
                matchFoundCallback(fixtureA, fixtureB);
            } else if (gameObjectB?.name === nameA && gameObjectA?.name === nameB) {
                matchFoundCallback(fixtureB, fixtureA);
            }
        }
    }

    private checkPairFixtureLabels_(fixtureA: b2Fixture, fixtureB: b2Fixture) {
        const fixtureDataA: IFixtureUserData = fixtureA.GetUserData();
        const fixtureDataB: IFixtureUserData = fixtureB.GetUserData();

        return (
            nameA: string, nameB: string,
            matchFoundCallback: (a: b2Fixture, b: b2Fixture) => void
        ) => {
            if (fixtureDataA?.fixtureLabel === nameA && fixtureDataB?.fixtureLabel === nameB) {
                matchFoundCallback(fixtureA, fixtureB);
            } else if (fixtureDataB?.fixtureLabel === nameA && fixtureDataA?.fixtureLabel === nameB) {
                matchFoundCallback(fixtureB, fixtureA);
            }
        }
    }
}