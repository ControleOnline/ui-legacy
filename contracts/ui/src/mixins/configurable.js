import api     from './api';
import filters from './filters';
import routes  from './routes';
import params  from './params';

export default {
  mixins: [ api, filters, routes, params ],

  props : {
    config: {
      type    : Function,
      required: false,
      default : function() { }
    },
  },

  created() {
    this.config({
      Api   : this.Api,
      Routes: this.Routes,
      Params: this.Params,
    });
  },
}
