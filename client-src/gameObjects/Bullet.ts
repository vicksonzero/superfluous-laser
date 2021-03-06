
import { collisionCategory } from '../../models/collisionCategory';
import { capitalize } from '../../utils/utils';
import { Team } from '../../models/Teams';
import { Tank } from './Tank';
import { b2Body, b2CircleShape, b2FixtureDef, b2BodyDef, b2BodyType, b2World } from '@flyover/box2d';
import { PIXEL_TO_METER, METER_TO_PIXEL } from '../../models/constants';
import { MainScene } from '../scenes/MainScene';

import * as Debug from 'debug';
import { getUniqueID } from '../../utils/UniqueID';
import { IFixtureUserData } from '../../models/systems/PhysicsSystem';
import { GameObjects, Scene } from 'phaser';

const log = Debug('superfluous-laser:Bullet:log');
// const warn = Debug('superfluous-laser:Bullet:warn');
// warn.log = console.warn.bind(console);

export class Bullet extends GameObjects.Container {

    scene: MainScene;
    uniqueID: number;
    team: Team;
    damage: number;
    range: number;
    sprite: GameObjects.Graphics;
    originalX: number;
    originalY: number;

    b2Body: b2Body;

    constructor(scene: MainScene, team: Team) {
        super(scene, 0, 0, []);
        this.uniqueID = getUniqueID();
        this.team = team;
        const color = this.team === Team.BLUE ? 0x3333EE : 0xEE3333;
        const graphics = this.scene.add.graphics({ fillStyle: { color } });
        this.add(graphics);
        this.sprite = graphics;
        this
            .setName('bullet');
    }
    init(x: number, y: number, damage: number, range: number): this {
        this.originalX = x;
        this.originalY = y;
        this
            .setX(x)
            .setY(y)
            ;
        this.damage = damage;
        this.range = range + 20; // add 20 for buffer
        this.sprite.fillCircleShape(new Phaser.Geom.Circle(0, 0, this.damage / 2 + 2));
        return this;
    }

    initPhysics(physicsFinishedCallback: () => void): this {
        const hostCollision = this.team === Team.BLUE ? collisionCategory.BLUE_BULLET : collisionCategory.RED_BULLET;
        const enemyCollision = this.team === Team.BLUE ? collisionCategory.RED : collisionCategory.BLUE;



        // see node_modules/@flyover/box2d/Box2D/Collision/Shapes for more shapes
        const circleShape = new b2CircleShape();
        circleShape.m_p.Set(0, 0); // position, relative to body position
        circleShape.m_radius = 5 * PIXEL_TO_METER; // radius, in meters

        const fixtureDef = new b2FixtureDef();
        fixtureDef.shape = circleShape;
        fixtureDef.density = 0;
        fixtureDef.isSensor = true;
        fixtureDef.filter.categoryBits = hostCollision;
        fixtureDef.filter.maskBits = collisionCategory.WORLD | enemyCollision;
        fixtureDef.userData = {
            fixtureLabel: 'bullet-body',
        } as IFixtureUserData;

        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_dynamicBody; // can move around
        bodyDef.position.Set(
            this.x * PIXEL_TO_METER,
            this.y * PIXEL_TO_METER,
        ); // in meters
        bodyDef.angle = 0; // in radians
        bodyDef.linearDamping = 0; // t = ln(v' / v) / (-d) , where t=time_for_velocity_to_change (s), v and v' are velocity (m/s), d=damping
        bodyDef.fixedRotation = true;
        bodyDef.allowSleep = false;
        bodyDef.userData = {
            label: 'bullet',
            gameObject: this,
        };

        // this.scene.getPhysicsSystem().scheduleCreateBody((world: b2World) => {
        //     this.b2Body = world.CreateBody(bodyDef);
        //     this.b2Body.CreateFixture(fixtureDef); // a body can have multiple fixtures
        //     this.b2Body.SetPositionXY(this.x * PIXEL_TO_METER, this.y * PIXEL_TO_METER);

        //     this.on('destroy', () => {
        //         this.scene.getPhysicsSystem().scheduleDestroyBody(this.b2Body);
        //         this.b2Body.m_userData.gameObject = null;
        //     });
        //     physicsFinishedCallback();
        // });

        return this;
    }

    isOutOfRange() {
        return this.range < Phaser.Math.Distance.Between(
            this.x, this.y, this.originalX, this.originalY
        );
    }
}
