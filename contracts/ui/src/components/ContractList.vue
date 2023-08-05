<template>
  <div>
    
    <div v-if="pageLoading" class="row">
      <div class="col-12 pageloader">
        <q-spinner
          color="primary"
          class="q-uploader__spinner"
        />
      </div>
    </div>

    <q-table
      v-else
      :loading        ="isLoading"
      :data           ="data"
      :columns        ="columns"
      :pagination.sync="pagination"
      @request        ="onRequest"
      row-key         ="id"
      style           ="min-height: 90vh;"
    >
      <template v-slot:top>
        <div class="col-3 q-mb-md text-h6">
          {{ translate('contracts.title') }}
        </div>
        <div class="col-9 q-mb-md">
          <div class="row justify-end">
            <q-btn flat
              :label  ="translate('contracts.new_contract')"
              icon    ="add"
              color   ="primary"
              class   ="q-ml-sm"
              @click  ="onCreate"
              :loading="isCreating"
            />
          </div>
        </div>

        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-input
      dense
      outlined stack-label
            :label      ="translate('contracts.search_by')"
            debounce    ="1000"
            v-model     ="filters.text"
            class       ="full-width"
            :placeholder="translate('contracts.search_phold')"
          />
        </div>
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-select dense outlined  stack-label
            :label  ="translate('contracts.status')"
            v-model ="filters.status"
            :options="statuses"
            class   ="full-width"
          />
        </div>
      </template>

      <template v-slot:body-cell-id="props">
        <q-td key="id">
          <q-btn dense
            :to   ="Routes.Details.get(props.row.id)"
            :label="props.value"
            class ="full-width"
          />
        </q-td>
      </template>
    </q-table>
    
  </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { mapGetters } from 'vuex';
import { formatDateYmdTodmY } from './../library/formatter';
import configurable from './../mixins/configurable';

export default {
  name  : 'ContractList',
  mixins: [ configurable ],

  computed: {
    ...mapGetters({
      defaultCompany : 'people/defaultCompany',
      cegCreateRoute : 'contracts/cegCreateRoute',
    })
  },

  created() {

    if (this.defaultCompany) {
      this.pageLoading = false;
    }

    this.columns = [
      {
        name  : 'id',
        field : 'id',
        align : 'left',
        format: (val) => {
          return `#${val}`;
        },
        label : this.translate('contracts.columns.id')
      },
      {
        name : 'beneficiario',
        align: 'left',
        field: 'beneficiario',
        label: this.translate('contracts.columns.contratante')
      },
      {
        name  : 'dataInicio',
        field : 'dataInicio',
        align : 'left',
        label : this.translate('contracts.columns.data_inicio'),
        format: (val) => {
          return formatDateYmdTodmY(val);
        }
      },
      {
        name  : 'dataFim',
        field : 'dataFim',
        align : 'left',
        label: this.translate('contracts.columns.data_fim'),
        format: (val) => {
          return formatDateYmdTodmY(val);
        }
      },
      {
        name : 'status',
        field: 'status',
        align: 'left',
        label: this.translate('contracts.columns.status'),
        format: (val) => {
          return this.translate(`contracts.statuses.${val}`)
        }
      },
    ];

    this.statuses = [
        {
          'label': this.translate('contracts.all'),
          'value': -1
        },
        {
          'label': this.translate(`contracts.statuses.${'Draft'}`),
          'value': 'Draft'
        },
        {
          'label': this.translate(`contracts.statuses.${'Waiting approval'}`),
          'value': 'Waiting approval'
        },
        {
          'label': this.translate(`contracts.statuses.${'Waiting signatures'}`),
          'value': 'Waiting signatures'
        },
        {
          'label': this.translate(`contracts.statuses.${'Active'}`),
          'value': 'Active'
        },
        {
          'label': this.translate(`contracts.statuses.${'Canceled'}`),
          'value': 'Canceled'
        },
        {
          'label': this.translate(`contracts.statuses.${'Amended'}`),
          'value': 'Amended'
        },
    ];

    this.onRequest({
      pagination: this.pagination,
      filter    : this.filters,
    });
  },

  data() {
    return {
      pageLoading : true,
      columns     : [],
      statuses    : [],
      data        : [],
      isCreating  : false,
      isLoading   : false,
      filters     : {
        text   : null,
        status : null,
      },
      pagination: {
        sortBy     : 'dataInicio',
        descending : false,
        page       : 1,
        rowsPerPage: 20,
        rowsNumber : 10,
      },
    }
  },

  watch: {
    defaultCompany(data) {
      if (data) {
        this.pageLoading = false;
      }
    },

    'filters.text'() {
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    },

    'filters.status'() {
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    },
  },

  methods: {    

    onCreate() {      
        if (!this.Params.Company.get()) {
          this.$q.notify({
            message : this.translate('contracts.errors.no_company'),
            position: 'bottom',
            type    : 'negative',
          });
          return;
        }

        this.isCreating = true;
        this.Api.Contracts
          .Create({
            payload: {},
            query  : {
              myProvider: this.Params.Company.get()
            }
          })
            .then((contract) => {
              if (contract['@id']) {
                this.$router.push(
                  this.Routes.Details.get(contract['@id'].replace(/\D/g, ''))
                );
              }
            })
            .catch((error) => {
              this.$q.notify({
                message : this.translate(error.message),
                position: 'bottom',
                type    : 'negative',
              });
            })
            .finally(() => {
              this.isCreating = false;
            });      
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      // prepare request params

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let filter = props.filter;
      let query  = { itemsPerPage: rowsPerPage, page };

      if (this.filters.text != null && this.filters.text.length > 0) {
        if (this.filters.text.length < 2)
          return;

        if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(this.filters.text)) {
          query['searchBy'] = this.filters.text.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/,"$3-$2-$1");
        }
        else {
          query['searchBy'] = this.filters.text;
        }
      }
      else {
        if (this.filters.status != null && this.filters.status.value != -1) {
          query['contractStatus'] = this.filters.status.value;
        }
      }

      if (this.Params.Company.get()) {
        query['myProvider'] = this.Params.Company.get();
        query['myCompany']  = this.Params.Company.get();
      }

      query['mycontract[startDate]'] = 'desc';

      // do request

      this.isLoading = true;
      this.Api.Contracts
        .GetAll({
          query
        })
          .then((contracts) => {
            if (!contracts) {
              throw new Error('No contracts');
            }

            let data = [];

            if (contracts != null) {
              for (let i in contracts.members) {
                let beneficiario = contracts.members[i].contractPeople
                  .find(people => people.peopleType == 'Beneficiary');

                data.push({
                  'id'          : contracts.members[i]['@id'].replace(/\D/g, ''),
                  'beneficiario': beneficiario ? beneficiario.people.name : '',
                  'dataInicio'  : contracts.members[i].startDate,
                  'dataFim'     : contracts.members[i].endDate,
                  'status'      : contracts.members[i].contractStatus,
                });
              }
            }

            return {
              members: data,
              total  : contracts.total
            };
          })
          .then((contracts) => {
            this.data = contracts.members;

            return {
              members: contracts.members,
              total  : contracts.total
            };
          })
          .then((contracts) => {
            this.pagination.rowsNumber  = contracts.total;
            this.pagination.page        = page;
            this.pagination.rowsPerPage = rowsPerPage;
            this.pagination.sortBy      = sortBy;
            this.pagination.descending  = descending;
          })
          .finally(() => {
            this.isLoading = false;
          })
      ;
    },
  },
};
</script>
