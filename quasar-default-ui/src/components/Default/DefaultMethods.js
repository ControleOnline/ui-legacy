export function copyObject(obj) {
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = obj.map((item) => this.copyObject(item));
    return newArray;
  }

  if ( obj instanceof Function) {
    return obj;
  }

  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = this.copyObject(obj[key]);
    }
  }

  return newObj || {};
}

export function mask(column) {
  if (column.mask instanceof Function) return column.mask();
}

export function isEmptyProxy(obj) {
  // Verifique se o objeto é um Proxy
  if (!obj ||  !(obj instanceof Object) || !obj.hasOwnProperty("__ob__")) {
    return this.isProxyEmpty(obj);
  }

  // Obtenha as chaves do objeto
  const keys = Object.keys(obj);

  // Verifique se não há nenhuma chave no objeto
  return keys.length === 0;
}

export function isProxyEmpty(proxy) {
  for (const _ in proxy) {
    if (proxy.hasOwnProperty(_)) {
      return false;
    }
  }
  return true;
}

export function isInvalid(key) {
  return true;
}

export function formatData(column, item, editing) {
  let data = this.format(
    column,
    column.list
      ? this.getNameFromList(column, item, editing)
      : this.getObjectFromKey(item, column.key || column.name)[
          column.key || column.name
        ]
  );

  return data;
}

export function getNameFromList(column, row, editing) {
  let name = null;
  if ( this.configs.list[column.list] instanceof  Function) {
    return row;
  } else {
    name = this.configs.list[column.list].find((item) => {
      return (
        item.value ==
        (row[column.key || column.name] instanceof Object &&
        row[column.key || column.name]
          ? row[column.key || column.name]["@id"].split("/").pop()
          : row[column.key || column.name])
      );
    });

    return name instanceof Object && !editing ? name.label : name;
  }
}

export async function getNameFromSearchList(column, row, editing, search = {}) {
  let name = null;
  let result = await this.configs.list[column.list](search).then((result) => {
    name = result.find((item) => {
      return (
        item["@id"].split("/").pop() ==
        (row[column.key || column.name] instanceof Object &&
        row[column.key || column.name]
          ? row[column.key || column.name]["@id"].split("/").pop()
          : row[column.key || column.name])
      );
    });
  });
  let x = this.formatList(column, name);

  return  x instanceof Object && !editing ? x.label : x;
}

export function searchList(input, update, abort) {
  
  let columnName = null;  


  if (Object.keys(this.showInput || {}).length > 0  ) {     
    let i = Object.keys(this.showInput);
    if (i)
        columnName = i[0];
  }  

  if (Object.keys(this.editing || {}).length > 0  ) {     
    this.editing.forEach((item) => {
          let i = Object.keys(item);
          if (i)
              columnName = i[0];
      });
  }


  const column = this.columns.find((col) => {
    return col.name === columnName || col.key === columnName
  });


  if ((input.length >= 3 || (!this.isLoadingList && input.length == 0 && ((this.listAutocomplete[column.list] && this.listAutocomplete[column.list].length == 0) || !this.listAutocomplete[column.list]))) && columnName) {

      let s = 'x';

      let params = { [s]: input };
      if ( this.configs.list[column.list] instanceof Function) {

        
        this.$store.commit(this.configs.store + '/SET_ISLOADINGLIST', true);

          this.configs.list[column.list](params).then((result) => {
              this.listAutocomplete[column.list] = [];              
              result.forEach((item) => {                
                  this.listObject[columnName] = item['@id'].split("/").slice(0, -1).join("/");   

                  this.listAutocomplete[column.list].push(this.formatList(column, item));
              });
              update();
          }).finally(()=>{
            this.$store.commit(this.configs.store + '/SET_ISLOADINGLIST', false);
          });
      } else {          
          this.listAutocomplete[column.list] = this.configs.list[column.list].filter((item) => {            
            return !input || item.value.toString().toLowerCase().includes(input.toLowerCase()) || item.label.toString().toLowerCase().includes(input.toLowerCase()) ;
          });
          update();
      }
  }
  update();
  //this.editedValue = [];
  //abort();
  //return;
}

export function getObjectFromKey(object, key) {
  let objetoAtual = object;
  if (key.indexOf(".") != -1) {
    let partesDaChave = key.split(".");
    for (let parte of partesDaChave) {
      objetoAtual = objetoAtual[parte];
    }
  }
  return objetoAtual;
}

export function formatList(column, value) {

  if (column && column.formatList instanceof Function)
    return column.formatList(value);

  return value;
}

export function format(column, value) {
  if (column && column.format instanceof Function) return column.format(value);

  return value;
}
export function saveFormat(columnName, value) {



  const column = this.columns.find((col) => {
    return col.name === columnName || col.key === columnName;
  });

  
  if (!column)
    return value;

  if ( column.saveFormat instanceof Function) return column.saveFormat(value);
  else if ( value instanceof Object)
    return !isNaN(value.value) ? parseFloat(value.value) : value.value;

  return !isNaN(value) ? parseFloat(value) : value;
}
