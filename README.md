# Superfluous-Laser

> Ten laser guns aren't going to cut it. You need Superfluous Laser! (MMO scrap space shooter)

- Shoot at things to get scraps
- Stick scraps onto your ship to build it
- Co-op or compete against each other to build the strongest biggest craft in the room!



Table of content:
- [Superfluous-Laser](#superfluous-laser)
- [How To Play](#how-to-play)
  - [Controls](#controls)
- [Getting started](#getting-started)
  - [Node version](#node-version)
  - [Start a prod server](#start-a-prod-server)
  - [Start Dev environment](#start-dev-environment)
  - [Build for Prod](#build-for-prod)
    - [Github Pages](#github-pages)
    - [Itch.io](#itchio)
- [How to use codebase](#how-to-use-codebase)
  - [How to read logs made with `log()`](#how-to-read-logs-made-with-log)
  - [More Docs](#more-docs)
  - [Important links](#important-links)
- [NPM scripts](#npm-scripts)
    - [Main tasks](#main-tasks)
    - [Sub tasks](#sub-tasks)
- [Tech Stack](#tech-stack)
- [Credits](#credits)
- [Roadmap](#roadmap)
- [License](#license)

# How To Play

Play here: https://vicksonzero.github.io/superfluous-laser/

## Controls

**Keyboard**: WASD to move, Arrows to aim and shoot  
**Touch**: Left stick to move, Right stick to aim and shoot

# Getting started

## Node version

```
12.18.3
```

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


## Build for Prod

```sh
npm install
npm run build
```

### Github Pages
If you set up `gh-pages` on github, commit and push `/client-dist/` to github to host the game.  
See `/index.html` for its link to `/client-dist/bundle.js`

### Itch.io
Alternatively, run `npm run itch` to generate a zip file suitable to be deployed to itch.io


# How to use codebase

- It is a server-client multiplayer game. we do all development work onto `master`.
- Entry point is `client.ts`  
- Main Phaser scene is `MainScene.ts` (duh)  
- `/models/components/*` Stores all data that can be snapshotted and restored
- `/models/systems/*` Stores all "reducers" that advances the state
- `/models/entities/*` Stores all entities, which are set of components to be instantiated together

## How to read logs made with `log()`

1. open the game in browser
2. Open console
3. input `_Debug.enable('superfluous-laser:*')` and press enter
4. Replace `'superfluous-laser:*'` with any filter you want. consult [npm package debug](https://www.npmjs.com/package/debug) for more doc


## More Docs

- https://photonstorm.github.io/phaser3-docs
- https://socket.io/docs/


## Important links

// TODO


# NPM scripts

### Main tasks

```
npm start                        Single command to start prod server. Does not include build
npm run build                    Builds client and server scripts (they are both in typescript)
npm run dev                      Single command to start dev environment
npm run dev-l                    npm run dev, but pipes output into a file
npm run dev-server               Start dev server
npm run dev-client               Start dev client
npm run itch                     Build client, and pack client-dist and assets into a zip file
npm run test                     Automated testing (always a good thing that no one does)
npm run lint                     lints all existing client scripts
```

### Sub tasks
Tasks for composition / alias.   
Usually have no need to call these directly.
```
npm run create-itch-zip
npm run build-client
npm run watch-webpack
npm run watch-node
npm run watch-ts
npm run webpack
npm run tsc
npm run client-size-analyse
```



# Tech Stack

- typescript (For Static type)
- webpack (For client side dependency management)
- phaser 3 (For Graphics)
- socketIO 3 (For client-server multiplayer communication)
- box2d.ts (For Stand-alone Physics Engine)
- debug.js (for logging with tags)

Future tech stack changes:
- Graphics: May downgrade into PIXI.js when ECS is done
- Multiplayer: May downgrade into websocket with binary packet construction


# Credits

- Programming
  - Dickson Chui (https://github.com/vicksonzero)
  - William Chong (https://github.com/williamchong007)
  - Sunday Ku (https://github.com/199911)
- Graphics
  - Kenney.nl (Once again!)
- Sound
  - To be determined


# Roadmap

- [ ] Dockerize

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


