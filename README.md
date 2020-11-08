# Superfluous-Laser



- [Superfluous-Laser](#superfluous-laser)
- [How To Play](#how-to-play)
  - [Controls](#controls)
- [Getting started](#getting-started)
  - [Start a prod server](#start-a-prod-server)
  - [Start Dev environment](#start-dev-environment)
  - [Build for Prod](#build-for-prod)
  - [How to read logs made with `log()`](#how-to-read-logs-made-with-log)
  - [More Docs](#more-docs)
  - [Important links](#important-links)
- [Tech Stack](#tech-stack)
- [Credits](#credits)
- [License](#license)

# How To Play

Play here: https://vicksonzero.github.io/superfluous-laser/

## Controls

**Keyboard**: WASD to move, Arrows to aim and shoot
**Touch**: Left stick to move, Right stick to aim and shoot

# Getting started

## Start a prod server

```
# if not yet built
npm install
npm run build

# if already built
npm start
```

## Start Dev environment

```sh
npm install
npm run dev
```

It is a share-screen offline multiplayer game. we do all development work onto `master`, and it will be seen on gh-pages    
Entry point is `client.ts`  
Main Phaser scene is `MainScene.ts` (duh)  
All meat starts with the `create()` and `update()` calls


## Build for Prod

```sh
npm install
npm run build
```

If you set up `gh-pages` on github, commit and push `/client-dist/` to github to host the game. See `/index.html` for its link to `/client-dist/bundle.js`

## How to read logs made with `log()`

1. open the game in browser
2. Open console
3. input `_Debug.enable('superfluous-laser:*')` and press enter
4. Replace `'superfluous-laser:*'` with any filter you want. consult [npm package debug](https://www.npmjs.com/package/debug) for more doc


## More Docs

https://photonstorm.github.io/phaser3-docs

## Important links

--


# Tech Stack

- [x] typescript (For Static type)
- [x] webpack (For client side dependency management; server side will just use `require()` after running tsc)
- [x] phaser 3 (For Graphics and some game rules)
- [x] box2d.ts (For Stand-alone Physics Engine)
- [x] debug.js (for logging with tags)


# Credits

- Programming
  - Dickson Chui (https://github.com/vicksonzero)
  - William Chong (https://github.com/williamchong007)
  - Sunday Ku (https://github.com/199911)
- Graphics
  - Kenney.nl (Once again!)
- Sound
  - To be determined

# License

BSD-3-Clause

- Can
    - Commercial Use
    - Modify
    - Distribute
    - Place Warranty
- Cannot
    - Use Trademark
    - Hold Liable
- Must
    - Include Copyright
    - Include License


