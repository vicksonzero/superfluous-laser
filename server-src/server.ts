import * as Debug from 'debug';
import { PHYSICS_FRAME_SIZE } from '../models/constants';
import { Model } from '../models/Model';
import { networkServerSystem } from '../models/systems/networkServerSystem';


// Debug.enable('socket.io:*,superfluous-laser:*');
Debug.enable('superfluous-laser:*');

// hack: to satisfy the tsconfig.json although we don't use server

const verbose = Debug('superfluous-laser:server:verbose');
const log = Debug('superfluous-laser:server:log');

log('server starting...');


const model = new Model();
model.init([
    networkServerSystem,
]);

let frameID = 0;
setInterval(() => {
    model.fixedUpdate(frameID, PHYSICS_FRAME_SIZE * frameID / 1000, PHYSICS_FRAME_SIZE);
    frameID++;
}, PHYSICS_FRAME_SIZE);

log('server started');