<template>
  <q-table
    :loading        ="isLoading"
    :data           ="data"
    :columns        ="settings.columns"
    :pagination.sync="pagination"
    @request        ="onRequest"
    row-key         ="@id"
    :visible-columns="settings.visibleColumns"
    style           ="min-height: 90vh;"
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
        <q-td auto-width
          v-if="invoice.status === 'pending' || invoice.billet === false"
          key ="removeAction"
        >
          <q-btn flat round dense
            color   ="red"
            icon    ="delete"
            @click  ="removeItem(props.row)"
            :loading="props.row._bussy"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { date }                   from 'quasar';
import { formatMoney  }           from '@controleonline/quasar-common-ui/src/utils/formatter';

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
    'removeAction'     ,
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
        return val.replace(/^(\d{4})\-(\d{2})\-(\d{2})T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/g,"\$3\/\$2\/\$1")
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
    { name: 'removeAction' },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    invoiceId: {
      type    : String,
      required: false,
      default : null,
    },
    invoice  : {
      type    : Object,
      required: true,
    }
  },

  created() {
    if (this.myCompany !== null) {
      this.filters.company = this.myCompany;
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    }
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    return {
      settings  : SETTINGS,
      data      : [],
      filters   : {
        company: null,
      },
      pagination: {
        sortBy     : 'ultimaModificacao',
        descending : false,
        page       : 1,
        rowsPerPage: 10,
        rowsNumber : 10,
      },
    }
  },

  computed: {
    ...mapGetters({
      isLoading : 'salesOrder/isLoading' ,
      error     : 'salesOrder/error'     ,
      violations: 'salesOrder/violations',
      items     : 'salesOrder/items'     ,
      totalItems: 'salesOrder/totalItems',
      myCompany : 'people/currentCompany',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.onRequest({
          pagination: this.pagination,
          filter    : this.filters,
        });
      }
    },

    totalItems(val) {
      this.pagination.rowsNumber = val;
    },

    items(items) {
      if (!items)
        return;

      let data = [];

      for (let index in items) {
        let item = items[index];

        data.push({
          '@id'              : item['@id'],
          'id'               : item['@id'].match(/^\/sales\/orders\/([a-z0-9-]*)$/)[1],
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
          '_bussy'           : false,
        });
      }

      this.data = data;
    },
  },

  methods: {
    ...mapActions({
      getItems   : 'salesOrder/getItems',
      reset      : 'salesOrder/reset'   ,
      removeOrder: 'receiveInvoice/deleteInvoiceOrder',
    }),

    removeItem(item) {
      if (window.confirm('Tem certeza que deseja eliminar este registro?')) {
        item._bussy = true;

        this.removeOrder({
          invoiceId: this.invoice['@id'],
          orderId  : item.id,
          params   : {
            myCompany: this.myCompany.id
          }
        })
          .then(result => {
            this.onRequest({
              pagination: this.pagination,
              filter    : this.filters,
            });
          })
          .catch(error => {
            this.$q.notify({
              message : error.message,
              position: 'bottom',
              type    : 'negative',
            });
          })
          .finally(() => {
            item._bussy = false;
          });
      }
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
      let filter = props.filter;
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.company != null) {
        params['myCompany'] = this.filters.company.id;
      }

      if (this.invoiceId !== null) {
        params['invoice.invoice'] = this.invoiceId;
      }

      params['order[alterDate]'] = 'desc';

      this.getItems(params)
        .then(() => {
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
        });
    },
  },
};
</script>