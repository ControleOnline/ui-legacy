import { version } from '../package.json'

import Searching from './components/Searching'

export {
  version,

  Searching

}

export default {
  version,

  Searching,

  install (Vue) {
    Vue.component(Searching.name, Searching)
  }
}
