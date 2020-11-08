import { PhysicsSystem } from './systems/PhysicsSystem';
// import { PositionHistoryItems, ReplayManager } from '../config/ReplayManager';
import { IAction, InputAction, RNGAction } from './eventList';
import { EventQueue } from './EventQueue';
import { ComponentSystem } from './systems/ComponentSystem';
import * as seedrandom from 'seedrandom';
import { DistanceMatrixSystem } from './systems/DistanceMatrixSystem';
import { PlayerInput } from './components/PlayerInput';
import { TransformComponent } from './components/TransformComponent';
import { ISystem } from './ISystem';


export class Model {
    states: ComponentSystem;
    frameID = 0;
    eventQueue: EventQueue;
    // replayManager: ReplayManager;
    // positionHistory: PositionHistoryItems[];
    rng: seedrandom.prng;
    distanceMatrixSystem: DistanceMatrixSystem;
    playerInputs: PlayerInput[];
    systems: ISystem[];

    constructor() {
        // this.replayManager = new ReplayManager();
        this.states = new ComponentSystem();
        this.frameID = 0;
        this.eventQueue = new EventQueue();
        // if (this.replayManager.isReplay) this.eventQueue.loadFromDataStr(this.replayManager.replayStr);
        // this.positionHistory = [];

        this.distanceMatrixSystem = new DistanceMatrixSystem();

        this.playerInputs = [...new Array(2)].map(_ => new PlayerInput());
    }

    init(systems: ISystem[]) {
        this.systems = systems;

        const seed = 'aaa';
        // call this.rng() to get next random number
        this.tryAddActionAt(this.frameID + 1, { type: 'rng', isSync: true, value: seed });
    }

    fixedUpdate(frameID: number, fixedTime: number, frameSize: number) {
        for (const callback of this.systems) {
            callback(frameID, this);
        }
        this.updateRNG(frameID);

        // const timeStep = 1000 / frameSize;
        // this.physicsSystem.update(
        //     timeStep,
        //     (DEBUG_PHYSICS_BODIES ? this.physicsDebugLayer : undefined)
        // );
        this.distanceMatrixSystem.init([]);
        // this.updateEntityPositions(frameID);
        this.updatePlayerInput(frameID);

        // verbose(`fixedUpdate end (frame-${this.frameID} ${this.fixedElapsedTime}ms ${this.fixedTime.now}ms)`);
        this.fixedLateUpdate(frameID, fixedTime, frameSize);
    }
    fixedLateUpdate(frameID: number, fixedTime: number, frameSize: number) {

    }

    updateRNG(frameID: number) {
        const events = this.eventQueue.getEventsOfFrame(frameID, 'rng') as RNGAction[];
        // if (events.length) console.log(frameID, JSON.stringify(events));
        for (const { value } of events) {
            this.rng = seedrandom(value);
        }
    }

    // updateEntityPositions(frameID: number) {
    //     if (frameID % 100 !== 0) return;
    //     // const list = [].map((component: TransformComponent) => {
    //     //     return [component.entityID, component.name, component.x, component.y];
    //     // });
    //     const res = {
    //         frameID,
    //         type: 'pos' as 'pos',
    //         list: [],
    //     };
    //     this.positionHistory.push(res);
    //     // console.log(frameID, JSON.stringify(list));
    //     if (frameID === 3000) {
    //         (window as any).save();
    //     }
    // }

    updatePlayerInput(frameID: number) {
        const events = this.eventQueue.getEventsOfFrame(frameID, 'input') as InputAction[];
        // if (events.length) console.log(frameID, JSON.stringify(events),
        //     this.bluePlayer.x,
        //     this.bluePlayer.y,
        //     this.redPlayer.x,
        //     this.redPlayer.y
        // );
        for (const { who, key, value } of events) {
            switch (key) {
                case 'action':
                    if (value === 'down') {
                        // const player = who === 0 ? this.bluePlayer : this.redPlayer;
                        // player.onActionPressed(this.sfx_point, this.sfx_open);
                    }
                    break;
                default:
            }
            this.playerInputs[who][key] = value === 'down';
        }
    }

    tryAddActionAt(frameID: number, action: IAction) {
        // if (this.replayManager.isReplay) return;

        this.eventQueue.addActionAt(frameID, action);
    }

}