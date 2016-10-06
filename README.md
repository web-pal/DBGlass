# DBGlass
[![Code Quality](https://api.codacy.com/project/badge/Grade/caadffe1b9c74253bda61b13b4de688a)](https://www.codacy.com/app/gloosx/DBGlass?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=web-pal/DBGlass&amp;utm_campaign=Badge_Grade)

*Simple cross-platform PostgreSQL client. Built with [Electron](https://github.com/atom/electron).*

![](https://www.evernote.com/shard/s18/sh/ed5ba0df-9d64-4077-a3fa-05b5d98840f3/7866c4205281c881/res/068519f7-ba08-4fb7-8cb0-67d69d706050/skitch.png)
## Features ([CHANGELOG](CHANGELOG.md))
- Straightforward and easy UI for creating, reading, updating and deleting your data without writing queries
- Rich markdown editor for your text data
- Simple constraint editor
- Connect to through SSH tunnel using password of public key
- Incredibly fast presentation of large tables

## How To Use
You can either
#### [Download Released App](https://github.com/web-pal/dbglass/releases)
Extract it somewhere, and then run the executable.

or
#### Package app manually from sources

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer. From your command line:

``` bash
# Clone this repository
git clone https://github.com/web-pal/dbglass
# Go into the repository
cd dbglass
# Install dependencies and run the app
npm install && npm run dev
```
App will be running in development mode at this point, in which you can:


##### Toggle Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

##### Ignore default modules

We add some module's `peerDependencies` to ignore option as default for application size reduction.

- `babel-core` is required by `babel-loader` and its size is ~19 MB
- `node-libs-browser` is required by `webpack` and its size is ~3MB.

> **Note:** If you want to use any above modules in runtime, for example: `require('babel/register')`, you should move them form `devDependencies` to `dependencies`.

##### Pack into an app for your platform from command line:

``` shell
npm run package
```

##### Building windows apps from non-windows platforms

Please checkout [Building windows apps from non-windows platforms](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms).

#### License [MIT](LICENSE.md)

