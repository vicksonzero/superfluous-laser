export type ConnectionAction = {
    type: 'connection';
    isSync: true;
    who: number;
    value: 'connect' | 'disconnect';
}

export type InputAction = {
    type: 'input';
    isSync: true;
    who: number;
    key: 'up' | 'down' | 'left' | 'right' | 'aimUp' | 'aimDown' | 'aimLeft' | 'aimRight' | 'action';
    value: 'up' | 'down';
}

export type CheatInputAction = {
    type: 'cheat-input';
    isSync: true;
    key: 'cheatSpawnUpgrades';
}

export type RNGAction = {
    type: 'rng';
    isSync: true;
    value: string;
}

export type IAction = (
    InputAction |
    RNGAction |
    ConnectionAction |
    CheatInputAction
);
