import Vue from "vue";
import Vuex from "vuex";

import auth from '@controleonline/quasar-login-ui/src/store/modules/auth';
import quote from '@freteclick/quasar-quote-ui/src/store/modules/quote';
import salesOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/sales";
import purchasingOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/purchasing";
import comissionOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/comission";
import gmaps from "@controleonline/quasar-common-ui/src/store/gmaps";
import people from "@controleonline/quasar-common-ui/src/store/people";
import config from "@controleonline/quasar-common-ui/src/store/config";
import profile from "@controleonline/quasar-common-ui/src/store/profile";
import user from "@controleonline/quasar-common-ui/src/store/user";
import dashboard from "./modules/dashboard";
import receiveInvoice from "./modules/invoice/receive";
import comissionInvoice from "./modules/invoice/comission";
import payInvoice from "./modules/invoice/pay";

Vue.use(Vuex);

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
      people,
      config,
      profile,
      user,
      dashboard,
      quote,
      salesOrder,
      purchasingOrder,
      comissionOrder,
      receiveInvoice,
      comissionInvoice,
      payInvoice
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
