import api     from './api';
import filters from './filters';

export default {
  mixins: [ api, filters ],

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
      routes: {},
    });
  },
}
