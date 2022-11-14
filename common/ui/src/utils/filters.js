import { LocalStorage } from "quasar";

export default class Filters {
  getFilter(router) {
    if (LocalStorage.has("session")) {
      let storedUser = LocalStorage.getItem("session");
      return storedUser.filters[router] || {};
    }
  }
  setFilter(router, value) {
    let storedUser = LocalStorage.getItem("session");
    storedUser.filters[router] = value;
    LocalStorage.set("session", storedUser);
  }
}
