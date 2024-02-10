
export const isDateGreaterThanToday = (date) => {
  // validate format

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date))
    return false;

  // validate is greater than today

  const today  = new Date();
  const _year  = parseInt(date.replace(/^\d{2}\/\d{2}\/(\d{4})$/, "$1"));
  const _month = parseInt(date.replace(/^\d{2}\/(\d{2})\/\d{4}$/, "$1")) - 1;
  const _day   = parseInt(date.replace(/^(\d{2})\/\d{2}\/\d{4}$/, "$1"));
  const _date  = new Date(_year, _month, _day);

  return _date > today;
};
