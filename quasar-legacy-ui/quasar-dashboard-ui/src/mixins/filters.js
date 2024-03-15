export default {
  filters: {
    formatToDmy(date) {
      return Formatter.formatDateYmdTodmY(date);
    },
    formatMoney(value) {
      return formatBRMoney(value);
    },
  },
};
