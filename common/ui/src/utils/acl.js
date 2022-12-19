import { LocalStorage } from "quasar";
import Api from "@@controleonline/quasar-common-ui/src/utils/api";

export default class acl {
  getPermissions() {    
    if (LocalStorage.has("session")) {      
      let storedUser = LocalStorage.getItem("session");      
      return  storedUser.actions ? storedUser.actions[storedUser["route"]] : {};      
    }

  };
  setPermission() {         
   this.fetchPermission();           
  }

  fetchPermission(){
      let storedUser = LocalStorage.getItem("session");
      let API = new Api(storedUser.token);
      let route = storedUser.route;
      if (!storedUser.actions) storedUser.actions = {};

        if (storedUser.mycompany && route)
      return API.private(`acoes/people`, {
        params: { myCompany: storedUser.mycompany, route: route },
      }).then((response) => response.json())
        .then((result) => {        
          storedUser.actions[route]=  result.response?result.response.data:{};                       
          LocalStorage.set("session", storedUser);
        });          
  }

 hasPermission(permission) {  
    let permissions = this.getPermissions();  
    if (Object.values(permissions).indexOf(permission) > -1) {
      return true;
    }
      return false;
  }
}