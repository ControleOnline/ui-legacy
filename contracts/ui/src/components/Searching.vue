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
        {{ title }}
      </div>
      <div class="col-9 q-mb-md">
        <div class="row justify-end">
          <q-btn
            label   ="Novo contrato"
            icon    ="add"
            size    ="md"
            color   ="primary"
            class   ="q-ml-sm"
            @click  ="createNewContract"
            :loading="isCreating"
          />
        </div>
      </div>

      <div class="col-sm-6 col-xs-12 q-pa-md">
        <q-input stack-label
          label   ="Buscar por"
          debounce="1000"
          v-model ="filters.text"
          class   ="full-width"
        />
      </div>
      <div class="col-sm-6 col-xs-12 q-pa-md">
        <q-select stack-label
          label   ="Status do contrato"
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
            :to   ="detailRoute(props.row.id)"
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
        return val.replace(/^(\d{4})\-(\d{2})\-(\d{2})$/g,"\$3\/\$2\/\$1");
      },
      label : 'Data inicio'
    },
    {
      name  : 'dataFim',
      field : 'dataFim',
      align : 'left',
      format: (val, row) => {
        if (typeof val == 'string') {
          return val.replace(/^(\d{4})\-(\d{2})\-(\d{2})$/g,"\$3\/\$2\/\$1");
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

export default {
  name: 'ContractsSearching',

  props: {
    title           : {
      type    : String,
      required: false
    },
    detailRoute     : {
      type    : Function,
      required: true
    },
    retrieveContract: {
      type    : Function,
      required: true
    },
    createContract  : {
      type    : Function,
      required: true
    },
  },

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
    createNewContract() {
      this.isCreating = true;

      this.createContract()
        .then(() => {
          this.$emit('contractCreated');
        })
        .finally(() => {
          this.isCreating = false;
        })
      ;
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      this.isLoading = true;

      this.retrieveContract({
        filters   : props.filters,
        pagination: props.pagination
      })
        .then((result) => {
          let {
              page,
              rowsPerPage,
              rowsNumber,
              sortBy,
              descending
          } = props.pagination;

          this.data = result.members;

          this.pagination.rowsNumber  = result.total;
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
