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
  else delete filters["search"];
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
  else return column.mask;
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

export function formatData(column, row, editing) {
  let data = this.format(
    column,
    row,
    this.getNameFromList(column, row, editing),
    editing
  );

  return data;
}
export function shouldIncludeColumn(column) {
  const isVisibleFunction = this.configs.columns && this.configs.columns[column.key || column.name]?.visible;
  const isExternalFilter = column.externalFilter === true;

  if (isExternalFilter) {
    if (typeof isVisibleFunction === 'function') {
      return isVisibleFunction(column);
    }
    return column.visible !== false;
  }
  return false;
}
export function getNameFromList(column, row, editing) {
  let name = null;
  if (column.list == undefined || typeof column.list == "string") {
    return row[column.key || column.name];
  } else {
    name = column.list.find((item) => {
      let i;
      if (item instanceof Object) i = this.formatList(column, item);
      else i = this.format(column, row, item);

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

export function formatFilter(column, value) {
  if (column && column.formatFilter instanceof Function)
    return column.formatFilter(value);

  return value;
}

export function getSearchFilters(column) {
  let configColumns = this.configs?.columns;
  let filters = configColumns
    ? configColumns[column.key || column.name]?.filters || {}
    : {};
  let params = this.copyObject(filters || {});

  return params;
}

export function formatList(column, value) {
  if (column && column.formatList instanceof Function)
    return column.formatList(value, column);

  return value;
}

export function format(column, row, value, editing) {
  if (editing && column && column.editFormat instanceof Function)
    return column.editFormat(value, column, row, editing);
  else if (column && column.format instanceof Function)
    return column.format(value, column, row, editing);

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
