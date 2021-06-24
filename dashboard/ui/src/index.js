import { name, version } from '../package.json'

import DashboardDefault  from './components/DashboardDefault'
import InactiveCustomers from './components/InactiveCustomers'

export {
  name,
  version,

  DashboardDefault ,
  InactiveCustomers,
}

export default {
  name,
  version,

  DashboardDefault ,
  InactiveCustomers,

  install (Vue) {
    Vue.component(DashboardDefault.name , DashboardDefault )
    Vue.component(InactiveCustomers.name, InactiveCustomers)
  }
}
