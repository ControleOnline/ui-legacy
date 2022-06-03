<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      <q-table
        bordered
        :loading        ="isLoading"
        :data           ="items"
        :columns        ="settings.columns"
        :pagination.sync="pagination"
        @request        ="onRequest"
        row-key         ="id"
        :visible-columns="settings.visibleColumns"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id"            :props="props">
              <q-btn outline dense
                :to   ="{ name: 'ContractDetails', params: { id: props.row.id } }"
                :label="props.cols[0].value"
                class ="full-width"
              />
            </q-td>
            <q-td key="beneficiario" :props="props">{{ props.row.beneficiario }}</q-td>
            <q-td key="dataInicio"   :props="props">{{ props.cols[2].value    }}</q-td>
            <q-td key="dataFim"      :props="props">{{ props.cols[3].value    }}</q-td>
            <q-td key="status"       :props="props">
              {{ $t(`contracts.statuses.${props.row.status}`) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';

const SETTINGS = {
  visibleColumns: [
    'id'          ,
    'beneficiario',
    'dataInicio'  ,
    'dataFim'     ,
    'status'      ,
  ],
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
        return val.replace(/^(\d{4})\-(\d{2})\-(\d{2})[a-zA-Z0-9:+]+$/g,"\$3\/\$2\/\$1");
      },
      label : 'Data inicio'
    },
    {
      name  : 'dataFim',
      field : 'dataFim',
      align : 'left',
      format: (val, row) => {
        if (typeof val == 'string'){
          return val.replace(/^(\d{4})\-(\d{2})\-(\d{2})[a-zA-Z0-9:+]+$/g,"\$3\/\$2\/\$1");
        }else{
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
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    id: {
      required: true,
    },
    api: {
      type    : Api,
      required: true
    },
  },

  data() {
    return {
      items    : [],
      settings : SETTINGS,
      isLoading: false,
      pagination: {
        sortBy     : 'dataInicio',
        descending : false,
        page       : 1,
        rowsPerPage: 10,
        rowsNumber : 10,
      },
    };
  },

  created() {
    this.onRequest({
      pagination: this.pagination
    });
  },

  methods: {
    // store method
    getItems(params) {
      return this.api.private('my_contract_peoples', { params })
        .then(response => response.json())
        .then(result => {
          return {
            members: result['hydra:member'],
            total  : result['hydra:totalItems']
          };
        });
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.id) {
        params['people']     = this.id;
        params['peopleType'] = 'Beneficiary';
      }

      this.isLoading = true;
      this.getItems(params)
        .then(data => {
          let _items = [];

          for (let index in data.members) {
            let item = data.members[index];

            _items.push({
              '@id'         : item.contract['@id'],
              'id'          : item.contract['@id'].replace(/\D/g, ''),
              'beneficiario': `${item.people.name} ${item.people.alias}`,
              'dataInicio'  : item.contract.startDate,
              'dataFim'     : item.contract.endDate,
              'status'      : item.contract.contractStatus,
            });
          }

          this.items                  = _items;
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
          this.pagination.rowsNumber  = data.total;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>