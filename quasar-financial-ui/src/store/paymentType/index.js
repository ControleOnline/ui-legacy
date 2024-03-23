import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Formatter from "@controleonline/quasar-common-ui/src/utils/formatter.js";

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "paymentTypes",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: {},
    columns: [
    ],
  },
  actions: actions,
  getters,
  mutations,
};
