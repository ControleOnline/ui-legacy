import { name, version } from '../package.json';

import ActiveContracts from './components/ActiveContracts';
import ActiveCustomers from './components/ActiveCustomers';
import AdministrativeExpenses from './components/AdministrativeExpenses';
import AverageTicket from './components/AverageTicket';
import ChartSalesMoney from './components/ChartSalesMoney';
import ChartSalesOrder from './components/ChartSalesOrder';
import ComissionOrderTotal from './components/ComissionOrderTotal';
import DashboardDefault from './components/DashboardDefault';
import InactiveCustomers from './components/InactiveCustomers';
import NetProfit from './components/NetProfit';
import NewCustomers from './components/NewCustomers';
import OperationalExpenses from './components/OperationalExpenses';
import OperationalProfit from './components/OperationalProfit';
import ProspectiveCustomers from './components/ProspectiveCustomers';
import QuoteOrderTotal from './components/QuoteOrderTotal';
import SalesOrderTotal from './components/SalesOrderTotal';

export {
    ActiveContracts, ActiveCustomers, AdministrativeExpenses, AverageTicket, ChartSalesMoney,
    ChartSalesOrder, ComissionOrderTotal, DashboardDefault,
    InactiveCustomers, NetProfit, NewCustomers, OperationalExpenses, OperationalProfit, ProspectiveCustomers,
    QuoteOrderTotal,
    SalesOrderTotal, name,
    version
};

export default {
  name,
  version,

  DashboardDefault,
  InactiveCustomers,
  ActiveCustomers,
  NewCustomers,
  ProspectiveCustomers,
  QuoteOrderTotal,
  SalesOrderTotal,
  AverageTicket,
  ComissionOrderTotal,
  OperationalExpenses,
  AdministrativeExpenses,
  ActiveContracts,
  ChartSalesMoney,
  ChartSalesOrder,
  NetProfit,
  OperationalProfit,
  install(Vue) {
    Vue.component(DashboardDefault.name, DashboardDefault)
    Vue.component(InactiveCustomers.name, InactiveCustomers)
    Vue.component(ActiveCustomers.name, ActiveCustomers)
    Vue.component(NewCustomers.name, NewCustomers)
    Vue.component(ProspectiveCustomers.name, ProspectiveCustomers)
    Vue.component(QuoteOrderTotal.name, QuoteOrderTotal)
    Vue.component(SalesOrderTotal.name, SalesOrderTotal)
    Vue.component(AverageTicket.name, AverageTicket)
    Vue.component(ComissionOrderTotal.name, ComissionOrderTotal)
    Vue.component(OperationalExpenses.name, OperationalExpenses)
    Vue.component(AdministrativeExpenses.name, AdministrativeExpenses)
    Vue.component(ActiveContracts.name, ActiveContracts)
    Vue.component(ChartSalesMoney.name, ChartSalesMoney)
    Vue.component(OperationalProfit.name, OperationalProfit)
    Vue.component(NetProfit.name, NetProfit)


  }
}
