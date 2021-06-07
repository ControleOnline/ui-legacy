import { version }  from '../package.json'

import ContractList from './components/ContractList'

export {
  version,

  ContractList
}

export default {
  version,

  ContractList,

  install (Vue) {
    Vue.component(ContractList.name, ContractList)
  }
}
