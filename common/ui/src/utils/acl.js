import { LocalStorage } from "quasar";
import Api from "@controleonline/quasar-common-ui/src/utils/api";

export default class acl {
  getPermission(action) {    
    let obj = {};
    if (LocalStorage.has("session")) {
      let storedUser = LocalStorage.getItem("session");      
      obj = storedUser.actions ? storedUser.actions[storedUser["route"]][action] : {};      
    }
    return obj;
  };
  setPermission() {
    let storedUser = LocalStorage.getItem("session");    
    let route = storedUser.route;    
    if (!storedUser.actions) storedUser.actions = {};
    //if (!storedUser.actions[route]) storedUser.actions[route] = {};    
    let permissions = this.fetchPermission();
    
        storedUser.actions[route] = permissions;
        LocalStorage.set("session", storedUser);
       
  }

fetchPermission(){
    let storedUser = LocalStorage.getItem("session");
    let API = new Api(storedUser.token);
    let route = storedUser.route;
    console.log(storedUser.actions? Object.keys(storedUser.actions[route]).length:null);
    if (route && storedUser.mycompany && 
        (!storedUser.actions || typeof storedUser.actions[route] == undefined)){        
    return API.private(`acoes/people`, {
      params: { myCompany: storedUser.mycompany, route: route },
    }).then((response) => response.json())
      .then((result) => {        
        return   result.response?result.response.data:{};        
      });
    }
    return {};
  
}
}