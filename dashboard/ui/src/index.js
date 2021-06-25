import { name, version } from '../package.json'

import DashboardDefault     from './components/DashboardDefault'
import InactiveCustomers    from './components/InactiveCustomers'
import ActiveCustomers      from './components/ActiveCustomers'
import NewCustomers         from './components/NewCustomers'
import ProspectiveCustomers from './components/ProspectiveCustomers'
import QuoteOrderTotal      from './components/QuoteOrderTotal'
import SalesOrderTotal      from './components/SalesOrderTotal'
import AverageTicket        from './components/AverageTicket'

export {
  name,
  version,

  DashboardDefault    ,
  InactiveCustomers   ,
  ActiveCustomers     ,
  NewCustomers        ,
  ProspectiveCustomers,
  QuoteOrderTotal     ,
  SalesOrderTotal     ,
  AverageTicket       ,
}

export default {
  name,
  version,

  DashboardDefault    ,
  InactiveCustomers   ,
  ActiveCustomers     ,
  NewCustomers        ,
  ProspectiveCustomers,
  QuoteOrderTotal     ,
  SalesOrderTotal     ,
  AverageTicket       ,

  install (Vue) {
    Vue.component(DashboardDefault.name    , DashboardDefault )
    Vue.component(InactiveCustomers.name   , InactiveCustomers)
    Vue.component(ActiveCustomers.name     , ActiveCustomers)
    Vue.component(NewCustomers.name        , NewCustomers)
    Vue.component(ProspectiveCustomers.name, ProspectiveCustomers)
    Vue.component(QuoteOrderTotal.name     , QuoteOrderTotal)
    Vue.component(SalesOrderTotal.name     , SalesOrderTotal)
    Vue.component(AverageTicket.name       , AverageTicket)
  }
}
