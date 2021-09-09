
export const formatDocument = (value) => {
  if (/^([0-9]{11})$/.test(value))
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");

  if (/^([0-9]{14})$/.test(value))
    return value
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");

  return value;
};

export const formatPhone    = (value) => {
  if (/^([0-9]{10})$/.test(value))
    return value.replace(/(\d{2})(\d{4})(\d{4})/g,"(\$1) \$2\-\$3");

  if (/^([0-9]{11})$/.test(value))
    return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, "(\$1) \$2 \$3\-\$4");

  return value;
};

export const formatCEP      = (value) => {
  if (value.length == 7)
    value = `0${value}`;

  return value
    .replace(/(\d{5})(\d{3})/g,"\$1\-\$2");
};

export const formatMoney    = (value, currency, locale) => {
  let formatter = new Intl.NumberFormat(locale, {
    style   : 'currency',
    currency: currency,
  });

  if (typeof value == 'string')
    value = value.replace(',', '.');

  return formatter.format(value);
};

export const formatDateYmdTodmY = (value, withTime = false) => {
  let result = value.match(/^(\d{4})\-(\d{2})\-(\d{2})\s*([\w:]*)/);

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
