import auth from "@controleonline/quasar-login-ui/src/store/modules/auth";
import quote from "@controleonline/quasar-quote-ui/src/store/modules/quote";
import coupon from "@controleonline/quasar-coupon-ui/src/store/coupon";
import salesOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/sales";
import purchasingOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/purchasing";
import comissionOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/comission";
import gmaps from "@controleonline/quasar-common-ui/src/store/gmaps";
import people from "@controleonline/quasar-common-ui/src/store/people";
import config from "@controleonline/quasar-common-ui/src/store/config";
import profile from "@controleonline/quasar-common-ui/src/store/profile";
import user from "@controleonline/quasar-common-ui/src/store/user";
import dashboard from "@controleonline/quasar-dashboard-ui/src/mixins/dashboard";
import receiveInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/receive";
import comissionInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/comission";
import payInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/pay";
import expense from "@controleonline/quasar-financial-ui/src/store/modules/invoice/expense";
import support from "@controleonline/quasar-support-ui/src/store/support";
import guides from "@controleonline/quasar-guides-ui/src/store/guides";
import categories from "@controleonline/quasar-common-ui/src/store/categories";
import menu from "@controleonline/quasar-common-ui/src/store/menu";
import users from "@controleonline/quasar-common-ui/src/store/users";

export const modules = {
  auth,
  coupon,
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
  payInvoice,
  expense,
  support,
  guides,
  categories,
  menu,
  users,
};
