import { version }  from '../package.json'

import ContractList from './components/ContractList'
import ContractForm from './components/ContractForm'

export {
  version,

  ContractList,
  ContractForm,
}

export default {
  version,

  ContractList,
  ContractForm,

  install (Vue) {
    Vue.component(ContractList.name, ContractList)
    Vue.component(ContractForm.name, ContractForm)
  }
}
