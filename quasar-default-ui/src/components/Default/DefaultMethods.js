export function copyObject(obj) {
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = obj.map((item) => this.copyObject(item));
    return newArray;
  }

  if (obj instanceof Function) {
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
export function filterColumn(colName) {
  const column = this.columns.find((col) => {
    return col.name === colName || col.key === colName;
  });

  let filters = this.copyObject(this.filters || []) || [];
  if (!this.colFilter[colName]) {
    delete filters[colName];
  } else if (this.colFilter[colName] instanceof Array) {
    filters[colName] = [];
    this.colFilter[colName].forEach((item) => {
      filters[colName].push(item);
    });
  } else {
    filters[colName] = this.formatFilter(column, this.colFilter[colName]);
  }

  this.applyFilters(filters);
  this.showInput = { [colName]: false };
  this.forceShowInput = { [colName]: false };
}
export function applyFilters(filters) {
  let f = this.copyObject(filters);
  let pf = this.copyObject(this.filters);
  if (f != pf) this.$store.commit(this.configs.store + "/SET_FILTERS", f);
}
export function onSearch() {
  let filters = this.copyObject(this.filters);
  if (this.search != "") filters["search"] = this.search;
  this.applyFilters(filters);
  this.sendFilter();
}
export function clearFilters() {
  let filters = this.copyObject(this.filters);

  this.columns.forEach((column) => {
    if ((column.key || column.name) in filters) {
      delete filters[column.key || column.name];
    }
  });
  delete filters.search;
  this.$store.commit(this.configs.store + "/SET_FILTERS", filters);
  this.sendFilter();
}
export function sendFilter() {
  this.$emit("loadData");
}
export function clearFilter(colName) {
  this.colFilter[colName] = undefined; // Limpa o filtro para a coluna correspondente
  this.filterColumn(colName);
}
export function setForceShowInput(colName) {
  this.showInput = { [colName]: true };
  this.forceShowInput = { [colName]: true };
}
export function mask(column) {
  if (column.mask instanceof Function) return column.mask();
}

export function isEmptyProxy(obj) {
  // Verifique se o objeto é um Proxy
  if (!obj || !(obj instanceof Object) || !obj.hasOwnProperty("__ob__")) {
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

    this.getNameFromList(column, item, editing),
    editing
  );

  return data;
}

export function getNameFromList(column, row, editing) {
  let name = null;
  if (
    this.configs.list[column.list] instanceof Function ||
    this.configs.list[column.list] == undefined
  ) {
    return row[column.key || column.name];
  } else {
    name = this.configs.list[column.list].find((item) => {
      let i;
      if (item instanceof Object) i = this.formatList(column, item);
      else i = this.format(column, item);

      return (
        i &&
        i.value &&
        i.value.toString().trim() ==
          (row[column.key || column.name] instanceof Object &&
          row[column.key || column.name]
            ? row[column.key || column.name]["@id"].split("/").pop().trim()
            : row[column.key || column.name].trim())
      );
    });
    return name instanceof Object && !editing
      ? this.formatList(column, name).label
      : this.formatList(column, name);
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

  return x instanceof Object && !editing ? x.label : x;
}

export function formatFilter(column, value) {
  if (column && column.formatFilter instanceof Function)
    return column.formatFilter(value);

  return value;
}

export function searchList(input, update, abort) {
  let columnName = null;

  if (Object.keys(this.showInput || {}).length > 0) {
    let i = Object.keys(this.showInput);
    if (i) columnName = i[0];
  }

  if (Object.keys(this.editing || {}).length > 0) {
    this.editing.forEach((item) => {
      let i = Object.keys(item);
      if (i) columnName = i[0];
    });
  }

  const column = this.columns.find((col) => {
    return col.name === columnName || col.key === columnName;
  });

  if (
    (input.length >= 3 ||
      (!this.isLoadingList &&
        input.length == 0 &&
        ((this.listAutocomplete[column.list] &&
          this.listAutocomplete[column.list].length == 0) ||
          !this.listAutocomplete[column.list]))) &&
    columnName
  ) {
    let s = column.searchParam || "search";
    let params = this.copyObject(column.filters || {});
    params[s] = input;

    if (this.configs.list[column.list] instanceof Function) {
      this.$store.commit(this.configs.store + "/SET_ISLOADINGLIST", true);
      this.listAutocomplete[column.list] = [];

      this.configs.list[column.list](params)
        .then((result) => {
          this.listAutocomplete[column.list].push(null);

          result.forEach((item) => {
            this.listObject[columnName] = item["@id"]
              .split("/")
              .slice(0, -1)
              .join("/");

            this.listAutocomplete[column.list].push(
              this.formatList(column, item)
            );
          });
          update();
        })
        .finally(() => {
          this.$store.commit(this.configs.store + "/SET_ISLOADINGLIST", false);
        });
    } else {
      this.listAutocomplete[column.list] = this.configs.list[column.list]
        .filter((item) => {
          return (
            column,
            !input ||
              this.formatList(column, item)
                .value.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              this.formatList(column, item)
                .label.toString()
                .toLowerCase()
                .includes(input.toLowerCase())
          );
        })
        .map((item) => {
          return this.formatList(column, item);
        });
      update();
    }
  }
  update();
  //this.editedValue = [];
  //abort();
  //return;
}

export function formatList(column, value) {
  if (column && column.formatList instanceof Function)
    return column.formatList(value, column);

  return value;
}

export function format(column, value, editing) {
  if (column && column.format instanceof Function)
    return column.format(value, column);

  return value instanceof Object && !editing ? value.label : value;
}
export function saveFormat(columnName, value) {
  const column = this.columns.find((col) => {
    return col.name === columnName || col.key === columnName;
  });

  if (!column) return value;

  if (column.saveFormat instanceof Function)
    return column.saveFormat(value, column);
  else if (value instanceof Object)
    return !isNaN(value.value) ? parseFloat(value.value) : value.value;

  return !isNaN(value) ? parseFloat(value) : value;
}
