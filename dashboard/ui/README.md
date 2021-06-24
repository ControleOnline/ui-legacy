# Contract Component

[![npm](https://img.shields.io/npm/v/@controleonline/quasar-dashboard-ui.svg?label=@controleonline/quasar-dashboard-ui)](https://www.npmjs.com/package/@controleonline/quasar-dashboard-ui)
[![npm](https://img.shields.io/npm/dt/@controleonline/quasar-dashboard-ui.svg)](https://www.npmjs.com/package/@controleonline/quasar-dashboard-ui)

# Contract Component
> ControleOnline Dashboard Quasar UI Component

# Usage

## Quasar CLI project

Create and register a boot file:

```js
import Vue    from 'vue'
import Plugin from '@controleonline/quasar-dashboard-ui'

Vue.use(Plugin)
```
# Setup
```bash
$ yarn add @controleonline/quasar-dashboard-ui@latest -D
```

# Developing
```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd

# start dev in SSR mode
$ yarn dev:ssr

# start dev in Cordova iOS mode
$ yarn dev:ios

# start dev in Cordova Android mode
$ yarn dev:android

# start dev in Electron mode
$ yarn dev:electron
```

# Building package
```bash
$ yarn build
```

# Adding Testing Components
in the `ui/dev/src/pages` you can add Vue files to test your component/directive. When using `yarn dev` to build the UI, any pages in that location will automatically be picked up by dynamic routing and added to the test page.

# Adding Assets
If you have a component that has assets, like language or icon-sets, you will need to provide these for UMD. In the `ui/build/script.javascript.js` file, you will find a couple of commented out commands that call `addAssets`. Uncomment what you need and add your assets to have them be built and put into the `ui/dist` folder.

# Donate
If you appreciate the work that went into this, please consider [donating to Quasar](https://donate.quasar.dev).

# License
MIT (c) Francisco Rivera
