import { QBadge } from 'quasar'

export default {
  name: 'Contracts',

  render (h) {
    return h(QBadge, {
      staticClass: 'Contracts',
      props: {
        label: 'Contracts'
      }
    })
  }
}
