<template>
  <q-table
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
        {{ $t('contracts.title') }}
      </div>
      <div class="col-9 q-mb-md">
        <div class="row justify-end">
          <q-btn
            :label  ="$t('contracts.new_contract')"
            icon    ="add"
            size    ="md"
            color   ="primary"
            class   ="q-ml-sm"
            @click  ="onCreate"
            :loading="isCreating"
          />
        </div>
      </div>

      <div class="col-sm-6 col-xs-12 q-pa-md">
        <q-input stack-label
          :label  ="$t('contracts.search_by')"
          debounce="1000"
          v-model ="filters.text"
          class   ="full-width"
        />
      </div>
      <div class="col-sm-6 col-xs-12 q-pa-md">
        <q-select stack-label
          :label  ="$t('contracts.status')"
          v-model ="filters.status"
          :options="statuses"
          class   ="full-width"
        />
      </div>
    </template>

    <template v-slot:body-cell-id="props">
      <q-td key="id">
        <q-btn dense
          :to   ="{ name: 'Default', params: { id: props.row.id } }"
          :label="props.value"
          class ="full-width"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import configurable           from './../mixins/configurable';
import { formatDateYmdTodmY } from './../library/formatter';

export default {
  name  : 'ContractList',
  mixins: [ configurable ],

  created() {
    this.columns = [
      {
        name  : 'id',
        field : 'id',
        align : 'left',
        format: (val) => {
          return `#${val}`;
        },
        label : this.$t('contracts.columns.id')
      },
      {
        name : 'beneficiario',
        align: 'left',
        field: 'beneficiario',
        label: this.$t('contracts.columns.contratante')
      },
      {
        name  : 'dataInicio',
        field : 'dataInicio',
        align : 'left',
        label : this.$t('contracts.columns.data_inicio'),
        format: (val) => {
          return formatDateYmdTodmY(val);
        }
      },
      {
        name  : 'dataFim',
        field : 'dataFim',
        align : 'left',
        label: this.$t('contracts.columns.data_fim'),
        format: (val) => {
          return formatDateYmdTodmY(val);
        }
      },
      {
        name : 'status',
        field: 'status',
        align: 'left',
        label: this.$t('contracts.columns.status'),
        format: (val) => {
          return this.$t(`contracts.statuses.${val}`)
        }
      },
    ];

    this.statuses = [
        {
          'label': this.$t('contracts.all'),
          'value': -1
        },
        {
          'label': this.$t(`contracts.statuses.${'Draft'}`),
          'value': 'Draft'
        },
        {
          'label': this.$t(`contracts.statuses.${'Waiting approval'}`),
          'value': 'Waiting approval'
        },
        {
          'label': this.$t(`contracts.statuses.${'Waiting signatures'}`),
          'value': 'Waiting signatures'
        },
        {
          'label': this.$t(`contracts.statuses.${'Active'}`),
          'value': 'Active'
        },
        {
          'label': this.$t(`contracts.statuses.${'Canceled'}`),
          'value': 'Canceled'
        },
        {
          'label': this.$t(`contracts.statuses.${'Amended'}`),
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
      columns   : [],
      statuses  : [],
      data      : [],
      isCreating: false,
      isLoading : false,
      filters   : {
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
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.text != null && this.filters.text.length > 0) {
        if (this.filters.text.length < 2)
          return;

        if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(this.filters.text)) {
          params['searchBy'] = this.filters.text.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/,"$3-$2-$1");
        }
        else {
          params['searchBy'] = this.filters.text;
        }
      }
      else {
        if (this.filters.status != null && this.filters.status.value != -1) {
          params['contractStatus'] = this.filters.status.value;
        }
      }

      params['mycontract[startDate]'] = 'desc';

      // do request

      this.isLoading = true;
      this.api.Contracts
        .GetAll({
          params
        })
          .then((contracts) => {
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
