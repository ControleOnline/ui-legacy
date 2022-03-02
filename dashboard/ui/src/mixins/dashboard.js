import { date } from 'quasar';

function formatDate(dateString) {
  return date.formatDate(date.extractDate(dateString, 'DD/MM/YYYY'), 'YYYY-MM-DD');
}

export default {
  props : {
    from: {
      type    : String,
      required: false,
    },
    to  : {
      type    : String,
      required: false,
    },
  },

  data() {
    return {
      query    : null,
      data     : {},
      isLoading: false,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData() {
      if (!this.Params.Company.get()) {
        return;
      }

      this.isLoading = true;

      this.Api.client
        .private(
          '/dashboards',
          {
            method: 'POST',
            body  : JSON.stringify({
            	"query"   : this.query,
            	"fromDate": formatDate(this.from),
            	"toDate"  : formatDate(this.to),
            	"company" : this.Params.Company.get(),
            	"viewType": this.Params.ViewType.get(),
            })
          }
        )
         .then(response => {
           if (response.ok) {
             return response.json()
               .then(data => {
                 if (data.response) {
                   if (data.response.success) {
                     return data.response.data;
                   }
                   else {
                     throw new Error(data.response.error);
                   }
                 }

                 return null;
               });
           }
           else {
             return response.json()
               .then(responseJson => {
                 throw new Error('Unknown error');
               });
           }
         })
         .then(data => {
           this.data = data;
         })
         .catch(error => {

         })
         .finally(() => {
           this.isLoading = false;
         })
      ;
    },

    reload() {      
      this.loadData();
    }
  },
}
