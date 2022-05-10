import { formatDateYmdTodmY } from './../library/formatter';

export default {
  filters: {
    formatToDmy(date) {
      return formatDateYmdTodmY(date)
    }
  },
}
