export function copyObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj || {};
  }

  if (Array.isArray(obj)) {
    const newArray = obj.map((item) => this.copyObject(item));
    return newArray;
  }

  if (typeof obj === 'function') {
    return obj || {};
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
  if (typeof column.mask == "function") return column.mask();
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
  let name = this.configs.list[column.list].find((item) => {
    return (
      item.value ==
      (typeof row[column.key || column.name] == "object"
        ? row[column.key || column.name]["@id"].split("/").pop()
        : row[column.key || column.name])
    );
  });
  return typeof name == "object" && !editing ? name.label : name;
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
export function format(column, value) {
  if (column && typeof column.format == "function") return column.format(value);

  return value;
}
export function saveFormat(columnName, value) {
  const column = this.columns.find((col) => {
    return col.name === columnName || col.key === columnName;
  });
  if (typeof column.saveFormat == "function") return column.saveFormat(value);
  else if (typeof value == "object")
    return !isNaN(value.value) ? parseFloat(value.value) : value.value;

  return !isNaN(value) ? parseFloat(value) : value;
}
