import categories from "@controleonline/quasar-common-ui/src/store/categories";
import config from "@controleonline/quasar-common-ui/src/store/config";
import gmaps from "@controleonline/quasar-common-ui/src/store/gmaps";
import menu from "@controleonline/quasar-common-ui/src/store/menu";
import people from "@controleonline/quasar-common-ui/src/store/people";
import profile from "@controleonline/quasar-common-ui/src/store/profile";
import user from "@controleonline/quasar-common-ui/src/store/user";
import users from "@controleonline/quasar-common-ui/src/store/users";
import coupon from "@controleonline/quasar-coupon-ui/src/store/coupon";
import dashboard from "@controleonline/quasar-dashboard-ui/src/mixins/dashboard";
import comissionInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/comission";
import expense from "@controleonline/quasar-financial-ui/src/store/modules/invoice/expense";
import payInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/pay";
import receiveInvoice from "@controleonline/quasar-financial-ui/src/store/modules/invoice/receive";
import guides from "@controleonline/quasar-guides-ui/src/store/guides";
import auth from "@controleonline/quasar-login-ui/src/store/modules/auth";
import comissionOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/comission";
import purchasingOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/purchasing";
import salesOrder from "@controleonline/quasar-orders-ui/src/store/modules/order/sales";
import quote from "@controleonline/quasar-quote-ui/src/store/modules/quote";
import shop from '@controleonline/quasar-shop-ui/src/store/modules/shop';
import support from "@controleonline/quasar-support-ui/src/store/support";

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
  shop,
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
