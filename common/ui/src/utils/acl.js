import { LocalStorage } from "quasar";


export default class acl {
  getPermissions() {    
    if (LocalStorage.has("session")) {      
      let storedUser = LocalStorage.getItem("session");      
      return  storedUser.actions ? storedUser.actions[storedUser["route"]] : {};      
    }

  };
  setPermission() {         
   api.fetchPermission();           
  }

  api.fetchPermission(){
      let storedUser = LocalStorage.getItem("session");
      let API = new Api(storedUser.token);
      let route = storedUser.route;
      if (!storedUser.actions) storedUser.actions = {};

        if (storedUser.mycompany && route)
      return API.private(`/actions/people`, {
        params: { myCompany: storedUser.mycompany, route: route },
      })
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