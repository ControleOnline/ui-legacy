/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf (conf) {
  // register our boot file
  conf.boot.push('~@controleonline/quasar-app-extension-contracts-ui/src/boot/register.js')

  // make sure app extension files & ui package gets transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-contracts-ui[\\/]src/)
  conf.build.transpileDependencies.push(/quasar-contracts-ui[\\/]src/)

  conf.css.push('~@controleonline/quasar-contracts-ui/src/index.sass')
}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.1.1')
  api.compatibleWith('@quasar/app', '^1.1.0 || ^2.0.0')

  // Uncomment the line below if you provide a JSON API for your component
  // api.registerDescribeApi('Contracts', '~quasar-ui-contracts/src/components/Contracts.json')

  // We extend /quasar.conf.js
  api.extendQuasarConf(extendConf)
}
