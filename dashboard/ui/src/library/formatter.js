
export const formatBRDocument = (value) => {
  if (/^([0-9]{11})$/.test(value)) {
    return value
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
  }

  if (/^([0-9]{14})$/.test(value)) {
    return value
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
  }

  return value;
};

export const formatBRPhone = (value) => {
  if (/^([0-9]{10})$/.test(value)) {
    return value
      .replace(/(\d{2})(\d{4})(\d{4})/g,"(\$1) \$2\-\$3");
  }

  if (/^([0-9]{11})$/.test(value)) {
    return value
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g,"(\$1) \$2 \$3\-\$4");
  }

  return value;
};

export const formatBRPostalCode = (value) => {
  if (value.length == 7) {
    value = `0${value}`;
  }

  return value.replace(/(\d{5})(\d{3})/g,"\$1\-\$2");
};

export const formatBRMoney = (value) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style   : 'currency',
    currency: 'BRL',
  });

  if (typeof value == 'string') {
    value = value.replace(',', '.');
  }

  return formatter.format(value);
};


export const formatDateYmdTodmY = (value, withTime = false) => {
  if (!value) {
    return '';
  }

  let result = value.match(/^(\d{4})\-(\d{2})\-(\d{2})([\w:]*)/);

  if (result === null)
    return value;

  if (withTime === true && result[4]) {
    let time = result[4].match(/(\d{2})\:(\d{2})\:(\d{2})/);

    if (time !== null) {
      return `${result[3]}/${result[2]}/${result[1]} ${time[1]}:${time[2]}:${time[3]}`;
    }
  }

  return `${result[3]}/${result[2]}/${result[1]}`;
};

export const formatAsTime = (dateTime) => {
  return dateTime
    .replace(/^\d{4}\-\d{2}\-\d{2}T(\d{2}):(\d{2}):(\d{2})\+00:00$/, '\$1:\$2');
};
