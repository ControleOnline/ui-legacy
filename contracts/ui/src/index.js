import { version }          from '../package.json'

import ContractList         from './components/ContractList'
import ContractForm         from './components/ContractForm'
import ContractNav          from './components/ContractNav'
import ContractActions      from './components/ContractActions'
import ContractActionCancel from './components/ContractActionCancel'
import ContractActionAmend  from './components/ContractActionAmend'

export {
  version,

  ContractList        ,
  ContractForm        ,
  ContractNav         ,
  ContractActions     ,
  ContractActionCancel,
  ContractActionAmend ,
}

export default {
  version,

  ContractList        ,
  ContractForm        ,
  ContractNav         ,
  ContractActions     ,
  ContractActionCancel,
  ContractActionAmend ,

  install (Vue) {
    Vue.component(ContractList.name        , ContractList        )
    Vue.component(ContractForm.name        , ContractForm        )
    Vue.component(ContractNav.name         , ContractNav         )
    Vue.component(ContractActions.name     , ContractActions     )
    Vue.component(ContractActionCancel.name, ContractActionCancel)
    Vue.component(ContractActionAmend.name , ContractActionAmend )
  }
}
