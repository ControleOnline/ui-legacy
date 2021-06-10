import { version }  from '../package.json'

import ContractList from './components/ContractList'
import ContractForm from './components/ContractForm'
import ContractNav  from './components/ContractNav'

export {
  version,

  ContractList,
  ContractForm,
  ContractNav ,
}

export default {
  version,

  ContractList,
  ContractForm,
  ContractNav ,

  install (Vue) {
    Vue.component(ContractList.name, ContractList)
    Vue.component(ContractForm.name, ContractForm)
    Vue.component(ContractNav.name , ContractNav )
  }
}
