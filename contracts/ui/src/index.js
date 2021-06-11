import { version }       from '../package.json'

import ContractList      from './components/ContractList'
import ContractForm      from './components/ContractForm'
import ContractNav       from './components/ContractNav'
import ContractDetail    from './components/ContractDetail'
import ActionCancel      from './components/ActionCancel'
import ActionAmend       from './components/ActionAmend'
import ActionParticipant from './components/ActionParticipant'

export {
  version,

  ContractList     ,
  ContractForm     ,
  ContractNav      ,
  ContractDetail   ,
  ActionCancel     ,
  ActionAmend      ,
  ActionParticipant,
}

export default {
  version,

  ContractList     ,
  ContractForm     ,
  ContractNav      ,
  ContractDetail   ,
  ActionCancel     ,
  ActionAmend      ,
  ActionParticipant,

  install (Vue) {
    Vue.component(ContractList.name     , ContractList  )
    Vue.component(ContractForm.name     , ContractForm  )
    Vue.component(ContractNav.name      , ContractNav   )
    Vue.component(ContractDetail.name   , ContractDetail)
    Vue.component(ActionCancel.name     , ActionCancel  )
    Vue.component(ActionAmend.name      , ActionAmend   )
    Vue.component(ActionParticipant.name, ActionParticipant)
  }
}
