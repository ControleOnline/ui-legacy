import { LocalStorage } from "quasar";

export default class Filters {
  getFilters() {
    let storedUser = this.getAllFilters();
    return storedUser && this.getRoute()
      ? storedUser[this.getRoute()] || {}
      : {};
  }
  getAllFilters() {
    return LocalStorage.getItem("filters") || {};
  }
  setFilter(data) {
    if (!this.getRoute()) return;

    let storedUser = this.getAllFilters();
    storedUser[this.getRoute()] = JSON.parse(JSON.stringify(data));
    LocalStorage.set("filters", storedUser);
  }

  getRoute() {
    let storedUser = LocalStorage.getItem("session");
    return storedUser ? storedUser["route"] : null;
  }
  
  getAllVisibleColumns() {
    return LocalStorage.getItem("VisibleColumns") || {};
  }

  getVisibleColumns() {
    let storedUser = this.getAllVisibleColumns();
    return storedUser && this.getRoute()
      ? storedUser[this.getRoute()] || {}
      : {};
  }
  
  setVisibleColumns(visibleColumns) {
    if (!this.getRoute()) return;    
    
    let storedUser = this.getVisibleColumns();
    storedUser[this.getRoute()] = visibleColumns;

    console.log(visibleColumns);
    console.log(storedUser[this.getRoute()]);
    LocalStorage.set("VisibleColumns", storedUser);
  }
}
