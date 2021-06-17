import { name, version } from '../package.json'

import FinancialExpenses from './components/FinancialExpenses'

export {
  name,
  version,

  FinancialExpenses,
}

export default {
  name,
  version,

  FinancialExpenses,

  install (Vue) {
    Vue.component(FinancialExpenses.name, FinancialExpenses)
  }
}
