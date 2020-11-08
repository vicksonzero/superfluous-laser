// measurements
export const WORLD_WIDTH = 1280; // px
export const WORLD_HEIGHT = 720 // px
export const METER_TO_PIXEL = 20; // pixel per meter
export const PIXEL_TO_METER = 1 / METER_TO_PIXEL; // meter per pixel

// game rules
export const PLAYER_MOVE_SPEED = 1; // px per second
export const BULLET_SPEED = 0.7; // px per second

// debug
export const DEBUG_DISABLE_SPAWNING = false; // default false
export const DEBUG_PHYSICS_BODIES = false; // default false, draws the physics bodies and constraints
export const AUDIO_START_MUTED = true; // default false

// physics
export const PHYSICS_FRAME_SIZE = 33; // ms
export const PHYSICS_ALLOW_SLEEPING = false; // default false
export const PHYSICS_MAX_FRAME_CATCHUP = 10; // times, default 10 times (10*33 = 330ms)
