import { LocalStorage } from "quasar";

export default class Filters {
  getFilters() {
    let storedUser = this.getAllFilters();
    return storedUser ? storedUser[this.getRoute()] : {};
  }
  getAllFilters() {
    return LocalStorage.getItem("filters") || {};
  }
  setFilter(data) {
    let storedUser = this.getAllFilters();
    storedUser[this.getRoute()] = data;
    LocalStorage.set("filters", storedUser);
  }

  getRoute() {
    let storedUser = LocalStorage.getItem("session");
    return storedUser["route"];
  }
}
