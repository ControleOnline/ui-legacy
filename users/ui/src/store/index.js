/* eslint-disable */
import Vue  from 'vue'
import Vuex from 'vuex'

import auth             from '@controleonline/quasar-login-ui/src/store/modules/auth';
import gmaps            from './modules/gmaps'
import quote            from './modules/quote'
import people           from './modules/people'
import config           from './modules/config'
import dashboard        from './modules/dashboard'
import bill             from './modules/bill'
import classes          from './modules/class'
import lesson           from './modules/lesson'
import schedule         from './modules/schedule'
import contract         from './modules/contract'
import profile          from './modules/profile'
import order            from './modules/order'
import menu             from './modules/menu'
import client           from "./modules/client"
import contracts        from "./modules/contracts"
import particulars      from "./modules/particulars"
import student          from './modules/student'
import receiveInvoice   from './modules/invoice/receive'
import payInvoice       from './modules/invoice/pay'
import comissionInvoice from './modules/invoice/comission'
import comissionOrder   from './modules/order/comission'
import salesOrder       from './modules/order/sales'
import purchasingOrder  from "./modules/order/purchasing"
import company          from './modules/company'
import trainer          from './modules/trainer'
import expense          from './modules/expense'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      gmaps,
      quote,
      people,
      config,
      dashboard,
      bill,
      classes,
      lesson,
      schedule,
      contract,
      profile,
      order,
      menu,
      client,
      contracts,
      particulars,
      student,
      receiveInvoice,
      comissionInvoice,
      comissionOrder,
      salesOrder,
      purchasingOrder,
      company,
      trainer,
      payInvoice,
      expense,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
