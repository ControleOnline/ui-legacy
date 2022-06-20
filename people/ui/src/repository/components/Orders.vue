<template>
  <div class="row form q-pa-md">
    <div class="col-3 text-h6">
      <div class="text-subtitle1 text-left">Pedidos de venda</div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table
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
            <q-td key="id"                :props="props">
              <q-btn outline dense
                :to   ="{ name: 'OrderDetails', params: { id: props.row.id }}"
                :label="`#${props.row.id}`"
                :style="{color:props.row.color_status}"
                class ="full-width"
              />		  
            </q-td>
            <q-td key="notaFiscal"        :props="props">{{ props.row.notaFiscal }}</q-td>        
            <q-td key="dataPedido"        :props="props">{{ props.cols[2].value }}</q-td>
            <q-td key="ultimaModificacao" :props="props">{{ props.cols[3].value }}</q-td>
            <q-td key="status"            :props="props" :style="{color:props.row.color_status}">
              {{ $t(`order.statuses.${props.row.status}`) }}
            </q-td>
            <q-td key="coleta"            :props="props">
              {{ props.row.localColeta  }}<br/>{{ props.row.coleta  }}
            </q-td>
            <q-td key="entrega"           :props="props">
              {{ props.row.localEntrega }}<br/>{{ props.row.entrega }}
            </q-td>
            <q-td key="transportadora"    :props="props">
              {{ props.row.transportadora }}
            </q-td>        
            <q-td key="preco"             :props="props">{{ props.cols[8].value }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { date }        from 'quasar';
import Api             from '@controleonline/quasar-common-ui/src/utils/api';
import { formatMoney } from '@controleonline/quasar-common-ui/src/utils/formatter'
import { mapGetters }  from 'vuex';

const SETTINGS = {
  visibleColumns: [
    'id'               ,
    'notaFiscal'       ,
    'dataPedido'       ,
    'ultimaModificacao',
    'status'           ,
    'coleta'           ,
    'entrega'          ,
    'transportadora'   ,    
    'preco'            ,
  ],
  columns       : [
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      label : 'ID'
    },
    {
      name : 'notaFiscal',
      field: 'notaFiscal',
      align: 'left',
      label: 'Nota Fiscal',
      format: (val, row) => {
        return val?'#'+val:''
      },
    },    
    {
      name  : 'dataPedido',
      field : 'dataPedido',
      align : 'left',
      format: (val, row) => {
        return date.formatDate(val, 'DD/MM/YYYY')
      },
      label : 'Data do pedido'
    },
    {
      name  : 'ultimaModificacao',
      field : 'ultimaModificacao',
      align : 'left',
      format: (val, row) => {
        return date.formatDate(val, 'DD/MM/YYYY HH:mm:ss')
      },
      label : 'Ultima alteração'
    },
    {
      name  : 'status',
      field : 'status',
      align : 'left',
      label : 'Status'
    },
    {
      name : 'coleta',
      field: 'coleta',
      align: 'left',
      label: 'Coleta'
    },
    {
      name : 'localColeta',
      field: 'localColeta',
      align: 'left',
      label: 'Local de coleta'
    },
    {
      name : 'entrega',
      field: 'entrega',
      align: 'left',
      label: 'Entrega'
    },
    {
      name : 'localEntrega',
      field: 'localEntrega',
      align: 'left',
      label: 'Local de entrega'
    },
    {
      name : 'transportadora',
      field: 'transportadora',
      align: 'left',
      label: 'Transportadora'
    },    
    {
      name  : 'preco',
      field : 'preco',
      align : 'left',
      format: (val, row) => {
        return formatMoney(val, 'BRL', 'pt-br');
      },
      label: 'Preço'
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
        sortBy     : 'ultimaModificacao',
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

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    // store method
    getItems(params) {
      return this.api.private('sales/orders', { params })
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

      if (this.myCompany != null) {
        params['myCompany'] = this.myCompany.id;
      }
      if (this.id) {
        params['client'] = this.id;
      }
      params['order[alterDate]'] = 'desc';

      this.isLoading = true;
      this.getItems(params)
        .then(data => {
          let _items = [];

          for (let index in data.members) {
            let item = data.members[index];

            _items.push({
              '@id'              : item['@id'],
              'id'               : item['@id'].replace(/\D/g, ''),
              'notaFiscal'       : item.invoiceTax.length > 0 ? '#'+item.invoiceTax[0].invoiceTax.invoiceNumber : '',
              'dataPedido'       : item.orderDate,
              'ultimaModificacao': item.alterDate,
              'status'           : item.orderStatus.status,
              'color_status'     : item.orderStatus.color,
              'fornecedor'       : item.client.alias,
              'coleta'           : item.retrievePeople !== null ? item.retrievePeople.name : '',
              'localColeta'      : item.quote !== null ? `${item.quote.cityOrigin.city} / ${item.quote.cityOrigin.state.uf}` : '',
              'entrega'          : item.deliveryPeople !== null ? item.deliveryPeople.name : '',
              'localEntrega'     : item.quote !== null ? `${item.quote.cityDestination.city} / ${item.quote.cityDestination.state.uf}` : '',
              'transportadora'   : item.quote !== null ? item.quote.carrier.name : '',          
              'preco'            : item.price,
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

<style lang="scss" scoped>
.form {
  background-color: white;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
