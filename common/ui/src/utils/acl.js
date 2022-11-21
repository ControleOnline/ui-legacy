import { LocalStorage } from "quasar";
import Api from "@controleonline/quasar-common-ui/src/utils/api";

export default class acl {
  getPermission() {
    let obj = {};
    if (LocalStorage.has("session")) {
      let storedUser = LocalStorage.getItem("session");
      obj = storedUser.actions
        ? storedUser.actions[storedUser["route"]][storedUser["route"]]
        : {};
    }
    return obj;
  }
  setPermission() {
    let storedUser = LocalStorage.getItem("session");
    let route = storedUser.route;
    if (!storedUser.actions) storedUser.actions = {};
    let permissions = this.fetchPermission();
    if (permissions != undefined) storedUser.actions[route] = permissions;
    LocalStorage.set("session", storedUser);
  }

  fetchPermission() {
    let storedUser = LocalStorage.getItem("session");
    let API = new Api(storedUser.token);
    let route = storedUser.route;

    if (
      route &&
      storedUser.mycompany &&
      (!storedUser.actions || storedUser.actions[route] == undefined)
    ) {
      return API.private(`acoes/people`, {
        params: { myCompany: storedUser.mycompany, route: route },
      })
        .then((response) => response.json())
        .then((result) => {
          return result.response ? result.response.data : {};
        });
    }
    return;
  }
  hasPermissao(permission) {
    let p = this.getPermission();
    return p[permission] ? p[permission] : false;
  }
}
