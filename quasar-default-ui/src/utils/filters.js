import { LocalStorage } from "quasar";

export default class Filters {

  constructor(router, store) {
    this.router = router;
    this.store = store;
  }

  getFilters() {
    if (!this.getRoute() || this.store) return {};

    let storedUser = this.getAllFilters();
    return storedUser
      ? storedUser[this.getRoute()][this.store] || {}
      : {};
  }

  setFilters(data) {
    if (!this.getRoute() || this.store) return;
    let storedUser = this.getAllFilters();
    storedUser[this.getRoute()][this.store] = data;
    LocalStorage.set("filters", storedUser);
  }

  getVisibleColumns() {
    if (!this.getRoute() || this.store) return {};
    let storedUser = this.getAllVisibleColumns();
    return storedUser
      ? storedUser[this.getRoute()][this.store] || {}
      : {};
  }

  setVisibleColumns(visibleColumns) {
    if (!this.getRoute() || this.store) return;
    let storedUser = this.getAllVisibleColumns();
    storedUser[this.getRoute()][this.store] = visibleColumns;
    LocalStorage.set("VisibleColumns", storedUser);

  }

  getAllFilters() {
    return LocalStorage.getItem("filters") || {};
  }

  getRoute() {
    return this.router?.name;
  }

  getAllVisibleColumns() {
    return LocalStorage.getItem("VisibleColumns") || {};
  }

}
