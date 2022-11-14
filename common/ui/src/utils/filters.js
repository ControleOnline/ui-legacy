import { LocalStorage } from "quasar";

export default class Filters {

  getFilters() {
    if (LocalStorage.has("session")) {
      let storedUser = LocalStorage.getItem("session");      
      return storedUser.filters[storedUser['route']] || {};
    }
  }
  setFilter(filters) {
    let storedUser = LocalStorage.getItem("session");
    storedUser.filters[storedUser['route']] = filters;
    LocalStorage.set("session", storedUser);
  }
}