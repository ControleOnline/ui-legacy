import { name, version } from '../package.json'

import DashboardDefault     from './components/DashboardDefault'
import InactiveCustomers    from './components/InactiveCustomers'
import ActiveCustomers      from './components/ActiveCustomers'
import NewCustomers         from './components/NewCustomers'
import ProspectiveCustomers from './components/ProspectiveCustomers'

export {
  name,
  version,

  DashboardDefault    ,
  InactiveCustomers   ,
  ActiveCustomers     ,
  NewCustomers        ,
  ProspectiveCustomers,
}

export default {
  name,
  version,

  DashboardDefault    ,
  InactiveCustomers   ,
  ActiveCustomers     ,
  NewCustomers        ,
  ProspectiveCustomers,

  install (Vue) {
    Vue.component(DashboardDefault.name    , DashboardDefault )
    Vue.component(InactiveCustomers.name   , InactiveCustomers)
    Vue.component(ActiveCustomers.name     , ActiveCustomers)
    Vue.component(NewCustomers.name        , NewCustomers)
    Vue.component(ProspectiveCustomers.name, ProspectiveCustomers)
  }
}
