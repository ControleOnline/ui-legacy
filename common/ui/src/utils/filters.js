import { LocalStorage } from "quasar";

export default class Filters {
  getFilters() {
    let obj = {};
    if (LocalStorage.has("session")) {
      let storedUser = LocalStorage.getItem("session");      
      obj = storedUser.filters ? storedUser.filters[storedUser["route"]] : {};      
    }
    return obj;
  }
  setFilter(filters) {
    let storedUser = LocalStorage.getItem("session");
    if (!storedUser.filters) {
      storedUser.filters = {};
    }
    storedUser.filters[storedUser["route"]] = filters;
    LocalStorage.set("session", storedUser);
  }
}
