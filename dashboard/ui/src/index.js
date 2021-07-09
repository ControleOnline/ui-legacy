import { name, version }      from '../package.json';

import DashboardDefault       from './components/DashboardDefault';
import InactiveCustomers      from './components/InactiveCustomers';
import ActiveCustomers        from './components/ActiveCustomers';
import NewCustomers           from './components/NewCustomers';
import ProspectiveCustomers   from './components/ProspectiveCustomers';
import QuoteOrderTotal        from './components/QuoteOrderTotal';
import SalesOrderTotal        from './components/SalesOrderTotal';
import AverageTicket          from './components/AverageTicket';
import ComissionOrderTotal    from './components/ComissionOrderTotal';
import OperationalExpenses    from './components/OperationalExpenses';
import AdministrativeExpenses from './components/AdministrativeExpenses';
import ActiveContracts        from './components/ActiveContracts';
import ChartSalesMoney        from './components/ChartSalesMoney';
import ChartSalesOrder        from './components/ChartSalesOrder';
import Enrollment             from './components/Enrollment';
import NewContracts           from './components/NewContracts';
import CanceledContracts      from './components/CanceledContracts';
import NetProfit              from './components/NetProfit';
import OperatingProfit        from './components/OperatingProfit';
import Royalts                from './components/Royalts';
import MarketingFee           from './components/MarketingFee';

export {
  name,
  version,

  DashboardDefault      ,
  InactiveCustomers     ,
  ActiveCustomers       ,
  NewCustomers          ,
  ProspectiveCustomers  ,
  QuoteOrderTotal       ,
  SalesOrderTotal       ,
  AverageTicket         ,
  ComissionOrderTotal   ,
  OperationalExpenses   ,
  AdministrativeExpenses,
  ActiveContracts       ,
  ChartSalesMoney       ,
  ChartSalesOrder       ,
  Enrollment            ,
  NewContracts          ,
  CanceledContracts     ,
  NetProfit             ,
  OperatingProfit       ,
  Royalts               ,
  MarketingFee          ,
}

export default {
  name,
  version,

  DashboardDefault      ,
  InactiveCustomers     ,
  ActiveCustomers       ,
  NewCustomers          ,
  ProspectiveCustomers  ,
  QuoteOrderTotal       ,
  SalesOrderTotal       ,
  AverageTicket         ,
  ComissionOrderTotal   ,
  OperationalExpenses   ,
  AdministrativeExpenses,
  ActiveContracts       ,
  ChartSalesMoney       ,
  ChartSalesOrder       ,
  Enrollment            ,
  NewContracts          ,
  CanceledContracts     ,
  NetProfit             ,
  OperatingProfit       ,
  Royalts               ,
  MarketingFee          ,

  install (Vue) {
    Vue.component(DashboardDefault.name      , DashboardDefault)
    Vue.component(InactiveCustomers.name     , InactiveCustomers)
    Vue.component(ActiveCustomers.name       , ActiveCustomers)
    Vue.component(NewCustomers.name          , NewCustomers)
    Vue.component(ProspectiveCustomers.name  , ProspectiveCustomers)
    Vue.component(QuoteOrderTotal.name       , QuoteOrderTotal)
    Vue.component(SalesOrderTotal.name       , SalesOrderTotal)
    Vue.component(AverageTicket.name         , AverageTicket)
    Vue.component(ComissionOrderTotal.name   , ComissionOrderTotal)
    Vue.component(OperationalExpenses.name   , OperationalExpenses)
    Vue.component(AdministrativeExpenses.name, AdministrativeExpenses)
    Vue.component(ActiveContracts.name       , ActiveContracts)
    Vue.component(ChartSalesMoney.name       , ChartSalesMoney)
    Vue.component(ChartSalesOrder.name       , ChartSalesOrder)
    Vue.component(Enrollment.name            , Enrollment)
    Vue.component(NewContracts.name          , NewContracts)
    Vue.component(CanceledContracts.name     , CanceledContracts)
    Vue.component(NetProfit.name             , NetProfit)
    Vue.component(OperatingProfit.name       , OperatingProfit)
    Vue.component(Royalts.name               , Royalts)
    Vue.component(MarketingFee.name          , MarketingFee)
  }
}
