import { version } from '../package.json'

import Dashboard from './components/Dashboard'

export {
  version,
  Dashboard,
}

export default {
  version,
  Dashboard,
  install(Vue) {
    Vue.component(Dashboard.name, Dashboard)
  }
}
