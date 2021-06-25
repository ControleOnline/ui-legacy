import {
  formatDateYmdTodmY,
  formatBRMoney,
} from './../library/formatter';

export default {
  filters: {
    formatToDmy(date) {
      return formatDateYmdTodmY(date)
    },
    formatMoney(value) {
      return formatBRMoney(value)
    }
  },
}
