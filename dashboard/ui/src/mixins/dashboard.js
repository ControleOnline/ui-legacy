import { date } from 'quasar';

function formatDate(dateString) {
  return date.formatDate(date.extractDate(dateString, 'DD/MM/YYYY'), 'YYYY-MM-DD');
}

export default {
  props: {
    filters: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      query: null,
      data: {},
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
            body: ({
              "query": this.query,
              "fromDate": formatDate(this.filters.from),
              "toDate": formatDate(this.filters.to),
              "company": this.Params.Company.get(),
              "viewType": this.Params.ViewType.get(),
            })
          }
        )
        .then(response => {
          if (response.ok) {
            return response
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
            return response
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
