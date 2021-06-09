import api   from './api';
import langs from './langs';

export default {
  mixins: [ api, langs ],

  props : {
    config: {
      type    : Function,
      required: false,
      default : function() { }
    },
  },

  created() {
    this.config({
      api   : this.api,
      lang  : this.langs,
      routes: {},
    });
  },
}
