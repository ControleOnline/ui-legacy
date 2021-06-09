<template>
  <q-table
    :loading        ="isLoading"
    :data           ="data"
    :columns        ="settings.columns"
    :pagination.sync="pagination"
    @request        ="onRequest"
    row-key         ="id"
    style           ="min-height: 90vh;"
  >
    <template v-slot:top>
      <div class="col-3 q-mb-md text-h6">
        {{ langs.TITLE }}
      </div>
      <div class="col-9 q-mb-md">
        <div class="row justify-end">
          <q-btn
            :label  ="langs.NEW_CONTRACT"
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
          :label  ="langs.SEARCH_BY"
          debounce="1000"
          v-model ="filters.text"
          class   ="full-width"
        />
      </div>
      <div class="col-sm-6 col-xs-12 q-pa-md">
        <q-select stack-label
          :label  ="langs.STATUS"
          v-model ="filters.status"
          :options="statuses"
          class   ="full-width"
        />
      </div>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          <q-btn dense
            :to   ="{ name: 'Default', params: { id: props.row.id } }"
            :label="props.cols[0].value"
            class ="full-width"
          />
        </q-td>
        <q-td key="beneficiario" :props="props">{{ props.row.beneficiario }}</q-td>
        <q-td key="dataInicio"   :props="props">{{ props.cols[2].value    }}</q-td>
        <q-td key="dataFim"      :props="props">{{ props.cols[3].value    }}</q-td>
        <q-td key="status"       :props="props">{{ props.row.status       }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
const SETTINGS = {
  columns       : [
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      format: (val, row) => {
        return `#${val}`;
      },
      label : 'ID'
    },
    {
      name : 'beneficiario',
      align: 'left',
      field: 'beneficiario',
      label: 'Contratante'
    },
    {
      name  : 'dataInicio',
      field : 'dataInicio',
      align : 'left',
      format: (val, row) => {
        return val.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1");
      },
      label : 'Data inicio'
    },
    {
      name  : 'dataFim',
      field : 'dataFim',
      align : 'left',
      format: (val, row) => {
        if (typeof val == 'string') {
          return val.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1");
        }
        else{
          return '-';
        }
      },
      label : 'Data fim'
    },
    {
      name : 'status',
      field: 'status',
      align: 'left',
      label: 'Status'
    },
  ]
};

const STATUSES = [
    {
      'label': 'Todos',
      'value': -1
    },
    {
      'label': 'Proposta',
      'value': 'Draft'
    },
    {
      'label': 'Aguardando assinatura',
      'value': 'Waiting approval'
    },
    {
      'label': 'Ativo',
      'value': 'Active'
    },
    {
      'label': 'Cancelado',
      'value': 'Canceled'
    },
    {
      'label': 'Alterado',
      'value': 'Amended'
    },
];

Object.freeze(SETTINGS);
Object.freeze(STATUSES);

import configurable from './../mixins/configurable';

export default {
  name  : 'ContractList',
  mixins: [ configurable ],

  created() {
    this.onRequest({
      pagination: this.pagination,
      filter    : this.filters,
    });
  },

  data() {
    return {
      settings  : SETTINGS,
      statuses  : STATUSES,
      data      : [],
      isCreating: false,
      isLoading : false,
      filters   : {
        text   : null,
        status : STATUSES[0],
        company: null,
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

      this.isLoading = true;

      this.api.Contracts
        .GetAll()
          .then((response) => {

          })
          .finally(() => {
            this.isLoading = false;
          })
      ;
    },
  },
};
</script>
