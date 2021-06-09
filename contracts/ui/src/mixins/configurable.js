import api     from './api';
import filters from './filters';
import routes  from './routes';

export default {
  mixins: [ api, filters, routes ],

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
      routes: this.routes,
    });
  },
}
